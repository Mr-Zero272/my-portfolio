export function generateSlug(input: string): string {
  return input
    .replace(/#/g, " hash-") // ✅ xử lý đặc biệt cho #
    .normalize("NFD") // tách chữ cái + dấu
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu tiếng Việt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // chỉ giữ alphabet + số + space + -
    .trim()
    .replace(/\s+/g, "-") // thay space bằng -
    .replace(/-+/g, "-"); // gộp nhiều dấu -
}

export function generateUniqueSlug(
  input: string,
  existingSlugs: string[]
): string {
  let slug = generateSlug(input);
  let count = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${generateSlug(input)}-${count}`;
    count++;
  }

  return slug;
}

export function generateSlugWithUnique(input: string): string {
  const baseSlug = generateSlug(input);

  // Tạo chuỗi unique ngắn: timestamp + random
  const unique =
    Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  return `${baseSlug}-${unique}`;
}
