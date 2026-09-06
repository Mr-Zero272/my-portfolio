import { ApiErrorCode, buildListQuery, FilterOperator, throwApiError } from '@/lib/api';
import { requireAdmin } from '@/lib/auth-guard';
import { generateId } from '@/lib/id';
import { prisma } from '@/lib/prisma';
import {
    checkObjectExists,
    deleteObjectFromR2,
    extractKeyFromR2Url,
    generatePresignedPutUrl,
    getR2PublicUrl,
} from '@/lib/r2';
import type { Prisma } from '@prisma/client';
import axios from 'axios';
import type {
    ConfirmUploadInput,
    GetPresignedUrlInput,
    UploadFromUrlInput,
} from '../schemas/gallery.schema';

const GALLERY_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'name', 'size'] as const;
const GALLERY_SEARCH_FIELDS = ['name', 'caption'] as const;

export const galleryService = {
  async getAll(headers: Headers, searchParams: URLSearchParams) {
    await requireAdmin(headers);

    const query = buildListQuery<Prisma.GalleryImageWhereInput>(searchParams, {
      searchFields: GALLERY_SEARCH_FIELDS,
      sortableFields: GALLERY_SORTABLE_FIELDS,
      filterFields: {
        mimeType: { field: 'mimeType', operator: FilterOperator.EQUALS },
      },
    });

    const [galleryImages, total] = await Promise.all([
      prisma.galleryImage.findMany({
        orderBy: query.orderBy,
        skip: query.pagination.skip,
        take: query.pagination.take,
        where: query.where,
      }),
      prisma.galleryImage.count({ where: query.where }),
    ]);

    return {
      galleryImages,
      pagination: query.pagination,
      total,
    };
  },

  async getById(headers: Headers, id: string) {
    await requireAdmin(headers);

    const image = await prisma.galleryImage.findUnique({
      where: { id },
    });

    if (!image) {
      throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Gallery image not found.' });
    }

    return image;
  },

  async delete(headers: Headers, id: string) {
    await requireAdmin(headers);

    const image = await prisma.galleryImage.findUnique({
      where: { id },
    });

    if (!image) {
      throwApiError(ApiErrorCode.NOT_FOUND, { message: 'Gallery image not found.' });
    }

    const key = extractKeyFromR2Url(image.url);
    if (key) {
      await deleteObjectFromR2(key);
    }

    await prisma.galleryImage.delete({ where: { id } });

    return { id };
  },

  async getPresignedUrl(headers: Headers, input: GetPresignedUrlInput) {
    await requireAdmin(headers);

    const fileId = generateId();
    const sanitizedFilename = input.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `gallery/${fileId}-${sanitizedFilename}`;

    const uploadUrl = await generatePresignedPutUrl({
      key,
      mimeType: input.mimeType,
      expiresInSeconds: 900,
    });

    const publicUrl = getR2PublicUrl(key);

    return {
      fileId,
      key,
      publicUrl,
      uploadUrl,
    };
  },

  async confirmUpload(headers: Headers, input: ConfirmUploadInput) {
    const { user } = await requireAdmin(headers);

    const exists = await checkObjectExists(input.key);
    if (!exists) {
      throwApiError(ApiErrorCode.BAD_REQUEST, {
        message: 'File does not exist on storage. Please upload the file before confirming.',
      });
    }

    const publicUrl = getR2PublicUrl(input.key);

    const galleryImage = await prisma.galleryImage.create({
      data: {
        caption: input.caption,
        mimeType: input.mimeType,
        name: input.name,
        size: input.size,
        url: publicUrl,
        userCreated: user.id,
      },
    });

    return galleryImage;
  },

  async uploadFromUrl(headers: Headers, input: UploadFromUrlInput) {
    const { user } = await requireAdmin(headers);

    let response;
    try {
      response = await axios.get(input.url, {
        responseType: 'arraybuffer',
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)',
        },
      });
    } catch {
      throwApiError(ApiErrorCode.BAD_REQUEST, {
        message: 'Failed to download image from the provided URL.',
      });
    }

    const rawContentType = String(response.headers['content-type'] || 'image/jpeg');
    const contentType = rawContentType.split(';')[0].trim();
    if (!contentType.startsWith('image/')) {
      throwApiError(ApiErrorCode.BAD_REQUEST, {
        message: 'The URL provided does not point to a valid image file.',
      });
    }

    const buffer = Buffer.from(response.data);
    const size = buffer.length;

    let filename = input.name;
    if (!filename) {
      try {
        const parsedUrl = new URL(input.url);
        const pathname = parsedUrl.pathname;
        const extracted = pathname.substring(pathname.lastIndexOf('/') + 1);
        if (extracted && extracted.includes('.')) {
          filename = extracted;
        }
      } catch {
        // Ignore parsing errors
      }
    }
    if (!filename) {
      const ext = contentType.split('/')[1] || 'jpg';
      filename = `image.${ext}`;
    }

    // const fileId = generateId();
    // const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    // const key = `gallery/${fileId}-${sanitizedFilename}`;

    // const publicUrl = await uploadBufferToR2({
    //   buffer,
    //   key,
    //   mimeType: contentType,
    // });

    const galleryImage = await prisma.galleryImage.create({
      data: {
        caption: input.caption,
        mimeType: contentType,
        name: filename,
        size,
        url: input.url,
        userCreated: user.id,
      },
    });

    return galleryImage;
  },
};
