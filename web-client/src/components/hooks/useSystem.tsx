import { createSignal, onMount } from 'solid-js';
import { SystemType } from '/src/types/system.type';

type SystemsResponseType = {
  count: number;
  systems: SystemType[];
};

export function useSystem() {
  const [count, setCount] = createSignal(0);
  const [systems, setSystems] = createSignal<SystemType[]>([]);
  const [error, setError] = createSignal<string | null>(null);

  const fetchSystems = () => {
    setError(null);

    const controller = new AbortController();
    const signal = controller.signal;

    fetch('/api/v1/systems', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch systems');
        }

        return response.json();
      })
      .then((data: SystemsResponseType) => {
        setCount(data.count);
        setSystems(data.systems);
      })
      .catch(err => setError(err.message));

    return {
      cancel: () => controller.abort(),
    };
  };

  onMount(() => fetchSystems());

  return {
    fetchSystems,
    count,
    systems,
    error,
  };
}
