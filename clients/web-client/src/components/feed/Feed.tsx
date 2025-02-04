import { useFeed } from '/src/components/feed/hooks/useFeed';
import { For, Show } from 'solid-js';

export function Feed() {
  const { feed } = useFeed();

  return (
    <div class="feed">
      <h3>Feed</h3>
      <div class="container">
        <Show when={feed().length} fallback={<span>Waiting for the data stream...</span>}>
          <ul>
            <For each={feed()}>
              {feed => (
                <li>
                  <span class="name">{feed.name}</span>
                  <span class="code">{feed.code}</span>
                  <span class="status">{feed.status}</span>
                  <span class="time">{feed.time}</span>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
    </div>
  );
}
