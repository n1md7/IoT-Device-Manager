import { createStore } from 'solid-js/store';
import { createEffect } from 'solid-js';
import { setIsOn, setLast } from '/src/stores/pump.store';

export type FeedItem = {
  status: 'ON' | 'OFF';
  name: string;
  code: string;
  time: number;
};

export function useFeed() {
  const [feed, setFeed] = createStore<FeedItem[]>([]);
  const source = new EventSource('/api/v1/timer/updates');

  createEffect(() => {
    source.onmessage = event => {
      const update: FeedItem = JSON.parse(event.data);
      setLast(update);
      setIsOn(update.status === 'ON');
      setFeed(prev => {
        prev.length = 10; // limit to 10 items
        // Reverse order so newest is at the top
        return [update, ...prev];
      });
    };
  });

  return { feed };
}
