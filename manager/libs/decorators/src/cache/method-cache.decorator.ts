import NodeCache from 'node-cache';
import ms from 'ms';

const cache = new NodeCache({
  stdTTL: 5 * 60, // 5 minutes
  checkperiod: 60, // 1 minute
});

export function Cached(TTL: Parameters<typeof ms>[0]) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: unknown[]) {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);

      const result = await originalMethod.apply(this, args);
      cache.set(key, result, ms(TTL) / 1000);
      return result;
    };
  };
}
