import { useMemo, useState } from 'react';

import { useDebouncedCallback } from './use-debounced-callback';

/**
 * Quản lý search state cho combobox server-side search.
 *
 * Theo pattern của base-ui: KHÔNG control `open` hay `inputValue` từ ngoài.
 * base-ui tự quản lý input display thông qua `itemToStringLabel`.
 *
 * Ordering trong component (bắt buộc vì hook rules):
 * ```
 * const { search, onInputValueChange, onOpenChangeComplete } = useComboboxState();
 * const { data } = useGetXxxSelect({ search: search || undefined, ... });
 * const { data: detail } = useGetXxx(value);
 * const { mergedItems, currentItem } = useComboboxMerge(value, data?.items, detail?.item);
 *
 * <Combobox
 *   filter={null}                           // tắt client-side filter
 *   onInputValueChange={onInputValueChange} // debounce + skip khi chọn item
 *   onOpenChangeComplete={onOpenChangeComplete} // reset search sau khi đóng
 *   ...
 * />
 * ```
 */
export function useComboboxState(debounceMs = 300) {
  const [search, setSearch] = useState('');

  const debouncedSetSearch = useDebouncedCallback((val: string) => {
    setSearch(val);
  }, debounceMs);

  const onInputValueChange = (val: string, eventDetails: { reason: string }) => {
    // Khi user chọn item, base-ui gọi onInputValueChange với reason 'item-press'
    // và val = itemToStringLabel(selectedItem). Không search lại.
    if (eventDetails.reason === 'item-press') return;

    if (!val) {
      setSearch('');
      return;
    }

    debouncedSetSearch(val);
  };

  // Dùng onOpenChangeComplete (sau animation) thay vì onOpenChange để tránh
  // list thay đổi trong khi close animation đang chạy.
  const onOpenChangeComplete = (open: boolean) => {
    if (!open) setSearch('');
  };

  return { search, onInputValueChange, onOpenChangeComplete };
}

/**
 * Merge detail item vào list để xử lý edge case edit mode:
 * item đang chọn có thể không nằm ở trang đầu kết quả search
 * → cần fetch detail riêng rồi ghép vào list để không bị mất.
 * Đồng thời dedup để tránh item xuất hiện hai lần.
 */
export function useComboboxMerge<T extends { id: string }>(
  value: string | undefined,
  items: T[],
  detailItem: T | null | undefined
) {
  const mergedItems = useMemo(() => {
    if (!value || !detailItem) return items;
    const isInList = items.some((item) => item.id === value);
    if (isInList) return items;
    return [...items, detailItem];
  }, [items, detailItem, value]);

  const currentItem = value ? (mergedItems.find((item) => item.id === value) ?? null) : null;

  return { mergedItems, currentItem };
}
