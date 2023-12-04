import { useTime } from '/src/components/feed/hooks/useTime';
import { createEffect } from 'solid-js';

export function Timer() {
  const time = useTime();

  createEffect(() => () => time.cancel());

  return (
    <div class="time preview">
      <span>{time.min().toString().padStart(2, '0')}</span>
      <span>:</span>
      <span>{time.sec().toString().padStart(2, '0')}</span>
    </div>
  );
}
