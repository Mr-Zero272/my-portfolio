import { useCallback, useState } from 'react';

export interface UseSearchGenericProps<T> {
  onSelect?: (item: T) => void;
  initialValue?: string;
}

export interface UseSearchGenericReturn<T> {
  isOpen: boolean;
  value: string;
  selectedItem: T | null;
  openSearch: () => void;
  closeSearch: () => void;
  setValue: (value: string) => void;
  onSelect: (item: T) => void;
  onOpenChange: (open: boolean) => void;
  onValueChange: (value: string) => void;
  reset: () => void;
}

/**
 * Hook để quản lý state cho SearchOverlay component
 * Giúp đơn giản hóa việc sử dụng SearchOverlay ở nhiều nơi khác nhau
 */
const useSearchGeneric = <T>({
  onSelect: externalOnSelect,
  initialValue = '',
}: UseSearchGenericProps<T> = {}): UseSearchGenericReturn<T> => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const onValueChange = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  const onSelect = useCallback(
    (item: T) => {
      setSelectedItem(item);
      if (externalOnSelect) {
        externalOnSelect(item);
      }
    },
    [externalOnSelect],
  );

  const reset = useCallback(() => {
    setIsOpen(false);
    setValue(initialValue);
    setSelectedItem(null);
  }, [initialValue]);

  return {
    isOpen,
    value,
    selectedItem,
    openSearch,
    closeSearch,
    setValue,
    onSelect,
    onOpenChange,
    reset,
    onValueChange,
  };
};

export default useSearchGeneric;
