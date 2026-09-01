const CUID_REGEX = /^c[a-z0-9]{24}$/;
export const isCuid = (id: string): boolean => CUID_REGEX.test(id);