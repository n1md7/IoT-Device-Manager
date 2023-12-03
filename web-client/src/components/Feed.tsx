import { createStore } from 'solid-js/store';
import { createEffect } from 'solid-js';
import { setIsOn } from '/src/stores/pump.store';

type FeedItem = {
  status: 'ON' | 'OFF';
  name: string;
  code: string;
  time: number;
};
export function Feed() {
  const [feed, setFeed] = createStore<FeedItem[]>([]);
  const source = new EventSource('/api/v1/timer/updates');

  createEffect(() => {
    source.onmessage = event => {
      const update: FeedItem = JSON.parse(event.data);
      setIsOn(update.status === 'ON');
      setFeed(prev => [...prev, update]);
    };
  });

  return (
    <div class="feed">
      <h3>Feed</h3>
      <div class="container">
        <ul>
          {feed.map(item => (
            <li>
              <span class="name">{item.name}</span>
              <span class="code">{item.code}</span>
              <span class="status">{item.status}</span>
              <span class="time">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
