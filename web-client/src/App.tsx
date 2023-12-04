import { WaterPump } from '/src/components/WaterPump';
import { Feed } from '/src/components/feed/Feed';

export function App() {
  return (
    <div class="container">
      <header>🏠</header>
      <h1>Home automation</h1>

      <p>This is the home automation app.</p>

      <WaterPump />
      <hr />
      <Feed />
    </div>
  );
}
