type callback = (...args: any[]) => any;
type Timeout = ReturnType<typeof setTimeout> | string | number | undefined;

export function useDelayFn<T extends callback>(callback: T, wait: number) {
  let delay: Timeout;

  return {
    invoke: (...args: Parameters<T>): void => {
      if (!delay) {
        callback(...args); // invoke immediately
        // Schedule a new invocation to block future invocations
        // until the wait time has passed
        delay = setTimeout(() => {
          delay = undefined;
        }, wait);
      }
    },
    cancel: () => {
      if (delay) {
        clearTimeout(delay);
        delay = undefined;
      }
    },
  };
}
