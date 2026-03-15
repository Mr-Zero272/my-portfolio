export async function measureTime<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    console.log(`✅ ${name}: ${duration.toFixed(0)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`❌ ${name}: ${duration.toFixed(0)}ms (failed)`, error);
    throw error;
  }
}
