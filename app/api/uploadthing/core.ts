import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

const auth = () => ({ id: 'fakeId' }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Image uploader for images, gifs, etc.
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(async ({}) => {
      const user = await auth();
      if (!user) throw new UploadThingError('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  // Video uploader
  videoUploader: f({
    video: {
      maxFileSize: '32MB',
      maxFileCount: 1,
    },
  })
    .middleware(async ({}) => {
      const user = await auth();
      if (!user) throw new UploadThingError('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  // Attachment uploader for documents, pdfs, etc.
  attachmentUploader: f({
    pdf: { maxFileSize: '4MB', maxFileCount: 1 },
    text: { maxFileSize: '2MB', maxFileCount: 1 },
    blob: { maxFileSize: '8MB', maxFileCount: 1 },
  })
    .middleware(async ({}) => {
      const user = await auth();
      if (!user) throw new UploadThingError('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  // Media uploader for mixed content (images, videos, documents)
  mediaUploader: f({
    image: { maxFileSize: '4MB', maxFileCount: 10 },
    video: { maxFileSize: '32MB', maxFileCount: 5 },
    pdf: { maxFileSize: '4MB', maxFileCount: 5 },
    text: { maxFileSize: '2MB', maxFileCount: 5 },
    blob: { maxFileSize: '8MB', maxFileCount: 5 },
  })
    .middleware(async ({}) => {
      const user = await auth();
      if (!user) throw new UploadThingError('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
