import { useCallback, useEffect, useState } from 'react';

interface UseImagePreviewOptions {
  maxSize?: number; // Kích thước tối đa file (bytes)
  acceptedTypes?: string[]; // Các loại file được chấp nhận
  multiple?: boolean; // Có cho phép chọn nhiều file không
}

interface PreviewImage {
  file: File;
  preview: string;
  id: string;
}

interface UseImagePreviewReturn {
  previews: PreviewImage[];
  files: File[];
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removePreview: (id: string) => void;
  clearPreviews: () => void;
  error: string | null;
  isLoading: boolean;
}

const useImagePreview = (options: UseImagePreviewOptions = {}): UseImagePreviewReturn => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB mặc định
    acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    multiple = false,
  } = options;

  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cleanup function để revoke data URLs khi component unmount
  useEffect(() => {
    return () => {
      // Không cần cleanup với FileReader data URLs
    };
  }, []);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return `Loại file không được hỗ trợ. Chỉ chấp nhận: ${acceptedTypes.join(', ')}`;
      }

      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        return `File quá lớn. Kích thước tối đa: ${maxSizeMB}MB`;
      }

      return null;
    },
    [acceptedTypes, maxSize],
  );

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      setError(null);
      setIsLoading(true);

      try {
        const filesToProcess = Array.from(fileList);

        // Nếu không cho phép multiple, chỉ lấy file đầu tiên
        const selectedFiles = multiple ? filesToProcess : filesToProcess.slice(0, 1);

        const validFiles: File[] = [];
        const newPreviews: PreviewImage[] = [];

        for (const file of selectedFiles) {
          const validationError = validateFile(file);
          if (validationError) {
            setError(validationError);
            continue;
          }

          validFiles.push(file);

          // Tạo preview URL bằng FileReader
          const reader = new FileReader();
          const preview = await new Promise<string>((resolve, reject) => {
            reader.onload = (e) => {
              if (e.target?.result) {
                resolve(e.target.result as string);
              } else {
                reject(new Error('Failed to read file'));
              }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
          });

          const id = `${file.name}-${file.lastModified}-${Math.random()}`;

          newPreviews.push({
            file,
            preview,
            id,
          });
        }

        if (multiple) {
          // Nếu cho phép multiple, thêm vào danh sách hiện tại
          setPreviews((prev) => [...prev, ...newPreviews]);
          setFiles((prev) => [...prev, ...validFiles]);
        } else {
          // Nếu không cho phép multiple, thay thế danh sách hiện tại
          setPreviews(newPreviews);
          setFiles(validFiles);
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi xử lý file');
        console.error('File processing error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [multiple, validateFile],
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
      // Reset input value để có thể chọn lại cùng một file
      event.target.value = '';
    },
    [processFiles],
  );

  const removePreview = useCallback(
    (id: string) => {
      setPreviews((prev) => prev.filter((p) => p.id !== id));

      setFiles((prev) => {
        const previewToRemove = previews.find((p) => p.id === id);
        if (previewToRemove) {
          return prev.filter((f) => f !== previewToRemove.file);
        }
        return prev;
      });
    },
    [previews],
  );

  const clearPreviews = useCallback(() => {
    // Không cần cleanup với FileReader data URLs
    setPreviews([]);
    setFiles([]);
    setError(null);
  }, []);

  return {
    previews,
    files,
    handleFileSelect,
    removePreview,
    clearPreviews,
    error,
    isLoading,
  };
};

export default useImagePreview;
