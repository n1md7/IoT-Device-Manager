import { useFeed } from '/src/components/feed/hooks/useFeed';
import { Show } from 'solid-js';

export function Feed() {
  const { feed } = useFeed();

  return (
    <div class="feed">
      <h3>Feed</h3>
      <div class="container">
        <Show when={feed.length} fallback={<span>Waiting for the data stream...</span>}>
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
        </Show>
      </div>
    </div>
  );
}
