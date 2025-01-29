import { createEffect, createSignal } from 'solid-js';
import * as pump from '/src/stores/pump.store';
import * as sprinkler from '/src/stores/sprinkler.store';

export type FeedItem = {
  status: 'ON' | 'OFF';
  name: string;
  code: string;
  time: number;
};

export function useFeed() {
  const [feed, setFeed] = createSignal<FeedItem[]>([]);
  const source = new EventSource('/api/v1/feed/updates');

  createEffect(() => {
    source.onmessage = event => {
      const update: FeedItem = JSON.parse(event.data);

      if (update.code === pump.code) {
        pump.setLast(update);
        pump.setIsOn(update.status === 'ON');
      }

      if (update.code === sprinkler.code) {
        sprinkler.setLast(update);
        sprinkler.setIsOn(update.status === 'ON');
      }

      setFeed(prev => {
        prev.length = 10; // limit to 10 items
        // Reverse order so newest is at the top
        return [update, ...prev];
      });
    };
  });

  return { feed };
}
