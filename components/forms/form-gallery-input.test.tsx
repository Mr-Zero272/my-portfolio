import type { UploadTask } from '@/lib/upload/types';
import { useUploadStore } from '@/stores/upload';
import type { GalleryImage } from '@prisma/client';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FormGalleryInput } from './form-gallery-input';

// ─── Mocks ──────────────────────────────────────────────────────────────────

const { mockEnqueue, mockRetry, mockCancel, mockDeleteGallery } = vi.hoisted(() => ({
  mockEnqueue: vi.fn(),
  mockRetry: vi.fn(),
  mockCancel: vi.fn(),
  mockDeleteGallery: vi.fn(),
}));

vi.mock('@/lib/upload', () => ({
  uploadManager: {
    enqueue: mockEnqueue,
    retry: mockRetry,
    cancel: mockCancel,
  },
}));

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

vi.mock('@/features/gallery/hooks/mutations', () => ({
  useDeleteGallery: () => ({ mutate: mockDeleteGallery }),
}));

vi.mock('@/features/gallery/components/gallery-picker-dialog', () => ({
  GalleryPickerDialog: ({
    open,
    onOpenChange,
    onSelect,
    multiple,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (images: GalleryImage | GalleryImage[]) => void;
    multiple?: boolean;
  }) => {
    if (!open) return null;
    const image = (id: string): GalleryImage =>
      ({ id, url: `https://cdn/${id}.png`, name: id }) as GalleryImage;

    return (
      <div data-testid="gallery-picker">
        <button type="button" onClick={() => onSelect(image('picked-1'))}>
          pick-picked-1
        </button>
        {multiple ? (
          <>
            <button type="button" onClick={() => onSelect([image('picked-2'), image('picked-3')])}>
              pick-two
            </button>
            <button
              type="button"
              onClick={() => onSelect([image('existing-1'), image('picked-2')])}
            >
              pick-dup
            </button>
          </>
        ) : null}
        <button type="button" onClick={() => onOpenChange(false)}>
          close
        </button>
      </div>
    );
  },
}));

// ─── Fixtures / helpers ─────────────────────────────────────────────────────

const existingImage: GalleryImage = {
  id: 'existing-1',
  url: 'https://cdn/existing-1.png',
  name: 'Existing One',
  size: 100,
  mimeType: 'image/png',
  caption: null,
  userCreated: 'user-1',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

const existingImage2: GalleryImage = {
  ...existingImage,
  id: 'existing-2',
  url: 'https://cdn/existing-2.png',
  name: 'Existing Two',
};

function renderField(defaultValues: Record<string, unknown>, ui: ReactNode) {
  let formApi: ReturnType<typeof useForm> | undefined;

  function Harness() {
    const form = useForm({ defaultValues });
    formApi = form;
    return <FormProvider {...form}>{ui}</FormProvider>;
  }

  const { container } = render(<Harness />);

  return {
    container,
    getValues: (name: string) => formApi?.getValues(name),
  };
}

function addTaskToStore(id: string, file: File, patch: Partial<UploadTask> = {}) {
  useUploadStore.getState().addTask({
    id,
    file,
    status: 'queued',
    progress: 0,
    error: null,
    retryCount: 0,
    maxRetries: 1,
    context: {},
    skipCompression: false,
    createdAt: new Date().toISOString(),
    ...patch,
  });
}

function uploadFile(container: HTMLElement, file: File) {
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
}

beforeEach(() => {
  mockEnqueue.mockReset().mockReturnValue('task-1');
  mockRetry.mockReset();
  mockCancel.mockReset();
  mockDeleteGallery.mockReset();
  useUploadStore.setState({ tasks: new Map() });
});

afterEach(() => {
  cleanup();
});

// ─── Single mode ────────────────────────────────────────────────────────────

describe('FormGalleryInput — single mode', () => {
  it('renders empty state with upload + pick buttons', () => {
    renderField({ imageId: '' }, <FormGalleryInput name="imageId" label="Image" />);

    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload image/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pick from gallery/i })).toBeInTheDocument();
  });

  it('previews an existing gallery image with its name', () => {
    renderField(
      { imageId: existingImage.id },
      <FormGalleryInput name="imageId" existing={existingImage} />,
    );

    const img = screen.getByRole('img', { name: 'Image preview' });
    expect(img).toHaveAttribute('src', existingImage.url);
    expect(screen.getByText('Existing One')).toBeInTheDocument();
  });

  it('writes the picked gallery id to the form without deleting it', async () => {
    const { getValues } = renderField({ imageId: '' }, <FormGalleryInput name="imageId" />);

    await screen.getByRole('button', { name: /pick from gallery/i }).click();
    expect(screen.getByTestId('gallery-picker')).toBeInTheDocument();

    await screen.getByRole('button', { name: 'pick-picked-1' }).click();

    expect(getValues('imageId')).toBe('picked-1');
    expect(mockDeleteGallery).not.toHaveBeenCalled();
  });

  it('writes the uploaded fileId to the form when the task completes', async () => {
    const { container, getValues } = renderField(
      { imageId: '' },
      <FormGalleryInput name="imageId" />,
    );

    const file = new File(['x'], 'photo.png', { type: 'image/png' });
    uploadFile(container, file);

    expect(mockEnqueue).toHaveBeenCalledWith(file);

    addTaskToStore('task-1', file);
    useUploadStore.getState().updateTask('task-1', {
      status: 'uploaded',
      progress: 100,
      result: { url: 'https://cdn/new.png', fileId: 'new-id' },
    });

    await waitFor(() => expect(getValues('imageId')).toBe('new-id'));
  });

  it('removes an existing image: deletes from gallery and clears the field', async () => {
    const { getValues } = renderField(
      { imageId: existingImage.id },
      <FormGalleryInput name="imageId" existing={existingImage} />,
    );

    await screen.getByRole('button', { name: 'Remove' }).click();

    expect(mockDeleteGallery).toHaveBeenCalledWith({ path: { id: 'existing-1' } });
    expect(getValues('imageId')).toBe('');
  });

  it('removing a picked image does NOT delete from gallery', async () => {
    const { getValues } = renderField({ imageId: '' }, <FormGalleryInput name="imageId" />);

    await screen.getByRole('button', { name: /pick from gallery/i }).click();
    await screen.getByRole('button', { name: 'pick-picked-1' }).click();

    await screen.getByRole('button', { name: 'Remove' }).click();

    expect(mockDeleteGallery).not.toHaveBeenCalled();
    expect(getValues('imageId')).toBe('');
  });

  it('shows retry on final upload error and retries the task', async () => {
    const { container } = renderField({ imageId: '' }, <FormGalleryInput name="imageId" />);

    const file = new File(['x'], 'photo.png', { type: 'image/png' });
    uploadFile(container, file);

    addTaskToStore('task-1', file, {
      status: 'error',
      error: 'Network error',
      retryCount: 1,
      maxRetries: 1,
    });

    await screen.findByRole('button', { name: /retry/i }).then((btn) => btn.click());

    expect(mockRetry).toHaveBeenCalledWith('task-1');
  });

  it('replaces the current image when picking after an upload (single item only)', async () => {
    const { getValues } = renderField({ imageId: '' }, <FormGalleryInput name="imageId" />);

    await screen.getByRole('button', { name: /pick from gallery/i }).click();
    await screen.getByRole('button', { name: 'pick-picked-1' }).click();

    expect(getValues('imageId')).toBe('picked-1');
    expect(screen.getAllByRole('img')).toHaveLength(1);
    // Replacing doesn't delete the previous image (still shared in gallery)
    expect(mockDeleteGallery).not.toHaveBeenCalled();
  });
});

// ─── Multiple mode ──────────────────────────────────────────────────────────

describe('FormGalleryInput — multiple mode', () => {
  it('renders all existing images', () => {
    renderField(
      { imageId: ['existing-1', 'existing-2'] },
      <FormGalleryInput name="imageId" multiple existing={[existingImage, existingImage2]} />,
    );

    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(screen.getByRole('img', { name: 'Existing One' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Existing Two' })).toBeInTheDocument();
  });

  it('appends an uploaded fileId to the value array', async () => {
    const { container, getValues } = renderField(
      { imageId: [] },
      <FormGalleryInput name="imageId" multiple />,
    );

    const file = new File(['x'], 'photo.png', { type: 'image/png' });
    uploadFile(container, file);

    addTaskToStore('task-1', file);
    useUploadStore.getState().updateTask('task-1', {
      status: 'uploaded',
      progress: 100,
      result: { url: 'https://cdn/new.png', fileId: 'new-id' },
    });

    await waitFor(() => expect(getValues('imageId')).toEqual(['new-id']));
  });

  it('appends a picked image to the value array (not replace)', async () => {
    const { getValues } = renderField(
      { imageId: ['existing-1'] },
      <FormGalleryInput name="imageId" multiple existing={[existingImage]} />,
    );

    await screen.getByRole('button', { name: /pick from gallery/i }).click();
    await screen.getByRole('button', { name: 'pick-picked-1' }).click();

    expect(getValues('imageId')).toEqual(['existing-1', 'picked-1']);
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('removes one item: filters the array and deletes the entity-owned image', async () => {
    const { getValues } = renderField(
      { imageId: ['existing-1', 'existing-2'] },
      <FormGalleryInput name="imageId" multiple existing={[existingImage, existingImage2]} />,
    );

    await screen.getByRole('button', { name: 'Remove Existing One' }).click();

    expect(mockDeleteGallery).toHaveBeenCalledWith({ path: { id: 'existing-1' } });
    expect(getValues('imageId')).toEqual(['existing-2']);
  });

  it('respects maxFiles: disables add buttons and shows a counter', async () => {
    renderField(
      { imageId: ['existing-1'] },
      <FormGalleryInput name="imageId" multiple maxFiles={1} existing={[existingImage]} />,
    );

    expect(screen.getByText('1/1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload image/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /pick from gallery/i })).toBeDisabled();
  });

  it('appends all images from a multi-select batch', async () => {
    const { getValues } = renderField(
      { imageId: [] },
      <FormGalleryInput name="imageId" multiple />,
    );

    await screen.getByRole('button', { name: /pick from gallery/i }).click();
    expect(screen.getByTestId('gallery-picker')).toBeInTheDocument();

    await screen.getByRole('button', { name: 'pick-two' }).click();

    expect(getValues('imageId')).toEqual(['picked-2', 'picked-3']);
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('dedupes already-selected images when picking a batch', async () => {
    const { getValues } = renderField(
      { imageId: ['existing-1'] },
      <FormGalleryInput name="imageId" multiple existing={[existingImage]} />,
    );

    await screen.getByRole('button', { name: /pick from gallery/i }).click();
    await screen.getByRole('button', { name: 'pick-dup' }).click();

    // existing-1 already present → skipped; picked-2 appended
    expect(getValues('imageId')).toEqual(['existing-1', 'picked-2']);
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('only appends up to the remaining maxFiles slots in a batch', async () => {
    const { getValues } = renderField(
      { imageId: ['existing-1'] },
      <FormGalleryInput name="imageId" multiple maxFiles={2} existing={[existingImage]} />,
    );

    await screen.getByRole('button', { name: /pick from gallery/i }).click();
    await screen.getByRole('button', { name: 'pick-two' }).click();

    // only 1 slot left → only picked-2 is added
    expect(getValues('imageId')).toEqual(['existing-1', 'picked-2']);
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });
});
