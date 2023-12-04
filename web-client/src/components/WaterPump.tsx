import { OffType, OnType, useControl } from '/src/components/feed/hooks/useControl';
import { isOn } from '/src/stores/pump.store';
import { useDelayFn } from '/src/common/hooks/useDelayFn';
import { createEffect, createSignal, Show } from 'solid-js';
import { On } from '/src/components/feed/status/On';
import { Off } from '/src/components/feed/status/Off';
import { useTime } from '/src/components/feed/hooks/useTime';
import { Timer } from '/src/components/Timer';

const onPayload: OnType = {
  code: 'D0001',
  status: 'ON',
  minutes: 10,
  seconds: 30,
};
const offPayload: OffType = {
  code: 'D0001',
  status: 'OFF',
};

export function WaterPump() {
  const [min, setMin] = createSignal(15);
  const [sec, setSec] = createSignal(0);

  const { sendRequest } = useControl();
  const time = useTime();
  const send = useDelayFn(() => {
    sendRequest(isOn() ? offPayload : onPayload);
  }, 1000); // Throttle to 1 second, avoid rapid clicks

  const handleSec = (e: Event) => {
    setSec(Number((e.target as HTMLInputElement).value));
  };
  const handleMin = (e: Event) => {
    setMin(Number((e.target as HTMLInputElement).value));
  };

  createEffect(() => {
    return () => {
      send.cancel();
      time.cancel();
    };
  });

  createEffect(() => {
    onPayload.minutes = min();
    onPayload.seconds = sec();
  }, [min, sec]);

  return (
    <div>
      <h2>
        Water Pump is:{' '}
        <Show when={isOn()} fallback={<Off />}>
          <On />
        </Show>
      </h2>
      <Show when={isOn()}>
        <Timer />
      </Show>
      <div class="time set">
        <label for="min">Min</label>
        <input id="min" type="number" placeholder="Min" value={min()} onChange={handleMin} />
        <label for="sec">Sec</label>
        <input id="sec" type="number" placeholder="Sec" value={sec()} onChange={handleSec} />
      </div>
      <button class="toggle" onClick={send.invoke}>
        Turn{' '}
        <Show when={isOn()} fallback={<On />}>
          <Off />
        </Show>
      </button>
    </div>
  );
}
