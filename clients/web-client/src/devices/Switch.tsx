import { useControl } from '../components/hooks/useControl';
import { isOn, setIsOn } from '../stores/pump.store';
import { useDelayFn } from '../common/hooks/useDelayFn';
import { createEffect, createSignal, Show } from 'solid-js';
import { On } from '../components/status/On';
import { Off } from '../components/status/Off';
import { useTime } from '../components/hooks/useTime';
import { Timer } from '../components/Timer';
import { DeviceType } from '../types/device.type';
import { ComponentType } from '../types/component.type';

type Props = {
  systemId: number;
  device: DeviceType;
  component: ComponentType;
};

export function Switch({ systemId, component, device }: Props) {
  const [min, setMin] = createSignal(15);
  const [sec, setSec] = createSignal(0);

  if (component.inUse) {
    setIsOn(true);
  }

  const { sendStopRequest, sendStartRequest } = useControl();
  const time = useTime();
  const send = useDelayFn(() => {
    isOn() ? sendStopRequest(systemId) : sendStartRequest(systemId, min(), sec());
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

  return (
    <div class="device">
      <h2>
        {device.name} is:{' '}
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
