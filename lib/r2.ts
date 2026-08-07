import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
const R2_CDN_BASE_URL = process.env.R2_CDN_BASE_URL || '';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export function getR2BucketName(): string {
  if (!R2_BUCKET_NAME) {
    throw new Error('R2_BUCKET_NAME is not configured in environment variables.');
  }
  return R2_BUCKET_NAME;
}

export function getR2PublicUrl(key: string): string {
  if (!R2_CDN_BASE_URL) {
    throw new Error('R2_CDN_BASE_URL is not configured in environment variables.');
  }
  const cleanBase = R2_CDN_BASE_URL.replace(/\/$/, '');
  const cleanKey = key.replace(/^\//, '');
  return `${cleanBase}/${cleanKey}`;
}

export async function generatePresignedPutUrl({
  key,
  mimeType,
  expiresInSeconds = 900,
}: {
  key: string;
  mimeType: string;
  expiresInSeconds?: number;
}): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
    ContentType: mimeType,
  });

  return getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
}

export async function checkObjectExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
    });
    await r2Client.send(command);
    return true;
  } catch {
    return false;
  }
}

export async function uploadBufferToR2({
  key,
  buffer,
  mimeType,
}: {
  key: string;
  buffer: Buffer;
  mimeType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  await r2Client.send(command);
  return getR2PublicUrl(key);
}

export async function deleteObjectFromR2(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
    });
    await r2Client.send(command);
    return true;
  } catch {
    return false;
  }
}

export function extractKeyFromR2Url(url: string): string | null {
  if (!R2_CDN_BASE_URL) return null;
  const cleanBase = R2_CDN_BASE_URL.replace(/\/$/, '');
  if (url.startsWith(cleanBase)) {
    return url.replace(`${cleanBase}/`, '');
  }
  return null;
}
