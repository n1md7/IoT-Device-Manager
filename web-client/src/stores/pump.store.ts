import { createSignal } from 'solid-js';
import { FeedItem } from '/src/components/feed/hooks/useFeed';

export const [isOn, setIsOn] = createSignal(false);
export const [last, setLast] = createSignal<FeedItem>({
  status: 'OFF',
  name: '',
  code: '',
  time: 0,
});
