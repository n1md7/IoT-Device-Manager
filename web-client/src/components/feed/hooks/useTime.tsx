import { createEffect, createMemo, createSignal } from 'solid-js';
import { last } from '/src/stores/pump.store';

export function useTime() {
  const [sec, setSec] = createSignal(0);
  const [min, setMin] = createSignal(0);
  const timer = createMemo(() =>
    setInterval(() => {
      if (sec() > 0) setSec(sec() - 1);
      else if (min() > 0) {
        setMin(min() - 1);
        setSec(59);
      }
    }, 1000),
  );
  const id = timer();

  createEffect(() => {
    const { time } = last();
    const seconds = time % 60;
    const minutes = Math.floor(time / 60);

    setSec(seconds);
    setMin(minutes);
  }, [last]);

  return { sec, min, cancel: () => clearInterval(id) };
}
