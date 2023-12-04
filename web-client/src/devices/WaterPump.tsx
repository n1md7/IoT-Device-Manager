import { OffType, OnType, useControl } from '/src/components/hooks/useControl';
import { code, isOn } from '/src/stores/pump.store';
import { useDelayFn } from '/src/common/hooks/useDelayFn';
import { createEffect, createSignal, Show } from 'solid-js';
import { On } from '/src/components/status/On';
import { Off } from '/src/components/status/Off';
import { useTime } from '/src/components/hooks/useTime';
import { Timer } from '/src/components/Timer';

const onPayload: OnType = {
  code: code,
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
    <div class="device">
      <h2>
        Water Pump is:{' '}
        <Show when={isOn()} fallback={<Off />}>
          <On />
        </Show>
      </h2>
      <Show when={isOn()}>
        <Timer />
      </Show>
      <Show when={!isOn()} fallback={'Automatic shutdown'}>
        <div class="time set">
          <p>Set time</p>
          <label for="p-min">Min</label>
          <input id="p-min" type="number" placeholder="Min" value={min()} onChange={handleMin} />
          <label for="p-sec">Sec</label>
          <input id="p-sec" type="number" placeholder="Sec" value={sec()} onChange={handleSec} />
        </div>
      </Show>
      <button class="toggle" onClick={send.invoke}>
        Turn{' '}
        <Show when={isOn()} fallback={<On />}>
          <Off />
        </Show>
      </button>
    </div>
  );
}
