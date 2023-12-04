import { Feed } from '/src/components/feed/Feed';
import { WaterPump } from '/src/devices/WaterPump';
import { Sprinkler } from '/src/devices/Sprinkler';

export function App() {
  return (
    <div class="container">
      <header>🏠</header>
      <h1>Home automation</h1>

      <p>This is the home automation app.</p>

      <div class="devices">
        <WaterPump />
        <Sprinkler />
      </div>
      <Feed />
    </div>
  );
}
