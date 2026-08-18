import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom không triển khai object URL API — stub để test upload flow
URL.createObjectURL = vi.fn(
  () => `blob:mock-${Math.random().toString(36).slice(2)}`,
) as unknown as typeof URL.createObjectURL;
URL.revokeObjectURL = vi.fn() as unknown as typeof URL.revokeObjectURL;

// matchMedia (dùng bởi use-mobile / theme providers)
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// ResizeObserver stub
if (!globalThis.ResizeObserver) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

// IntersectionObserver stub (gallery picker dùng useIntersection)
if (!globalThis.IntersectionObserver) {
  class IntersectionObserverStub {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  globalThis.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver;
}
