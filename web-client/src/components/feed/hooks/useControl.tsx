import { createSignal } from 'solid-js';

export type OnType = {
  status: 'ON';
  code: string;
  minutes: number;
  seconds: number;
};
export type OffType = {
  status: 'OFF';
  code: string;
};
export type Payload = OnType | OffType;

export function useControl() {
  const [error, setError] = createSignal<string | null>(null);

  const sendRequest = (payload: Payload) => {
    setError(null);
    fetch('/api/v1/timer/control', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(err => setError(err.message));
  };

  return { error, sendRequest };
}
