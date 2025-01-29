import { createSignal } from 'solid-js';

type Action = {
  id: number;
  action: 'START' | 'STOP';
};

export interface StartType extends Action {
  duration: {
    /**
     * Value of seconds. Only the seconds part of the time [0, 59]
     */
    sec: number;
    /**
     * Value of minutes. Only the minutes part of the time [0, 99]
     */
    min: number;
  };
}

export interface StopType extends Action {}

export function useControl() {
  const [error, setError] = createSignal<string | null>(null);
  const createStartPayload = (id: number, min: number, sec: number) =>
    ({
      id,
      action: 'START',
      duration: {
        sec,
        min,
      },
    }) as StartType;
  const createOFFPayload = (id: number) =>
    ({
      id,
      action: 'STOP',
    }) as StopType;

  const sendRequest = (payload: StartType | StopType) => {
    setError(null);

    const controller = new AbortController();
    const signal = controller.signal;

    fetch('/api/v1/systems/control', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
      body: JSON.stringify(payload),
    }).catch(err => setError(err.message));

    return {
      cancel: () => controller.abort(),
    };
  };

  const sendStartRequest = (id: number, min: number, sec = 0) => {
    sendRequest(createStartPayload(id, min, sec));
  };

  const sendStopRequest = (id: number) => {
    sendRequest(createOFFPayload(id));
  };

  return { error, sendRequest, sendStartRequest, sendStopRequest };
}
