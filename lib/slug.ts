// lib/slugify.ts

interface SlugifyOptions {
  /** Giữ lại dấu '-' ở cuối chuỗi — cần khi user đang gõ dở (vd "san-pham-" chưa xong) */
  keepTrailingHyphen?: boolean;
  /** Giới hạn độ dài slug, cắt tại ranh giới từ gần nhất */
  maxLength?: number;
}

export function slugify(input: string, options: SlugifyOptions = {}): string {
  const { keepTrailingHyphen = false, maxLength } = options;

  if (!input) return '';

  let result = input
    .trim()
    // đ/Đ không tách được bằng NFD, phải map tay trước
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    // tách tổ hợp ký tự + dấu thanh (NFD), rồi bỏ phần dấu (category Mn)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    // mọi ký tự không phải a-z, 0-9 -> '-'
    .replace(/[^a-z0-9]+/g, '-')
    // gộp nhiều '-' liên tiếp thành 1
    .replace(/-+/g, '-')
    // bỏ '-' ở đầu
    .replace(/^-+/, '');

  if (!keepTrailingHyphen) {
    result = result.replace(/-+$/, '');
  }

  if (maxLength && result.length > maxLength) {
    result = result.slice(0, maxLength);
    // tránh cắt lửng giữa từ, lùi về dấu '-' gần nhất nếu có
    const lastHyphen = result.lastIndexOf('-');
    if (lastHyphen > maxLength * 0.6) {
      result = result.slice(0, lastHyphen);
    }
    if (!keepTrailingHyphen) {
      result = result.replace(/-+$/, '');
    }
  }

  return result;
}
