import { Feed } from '/src/components/feed/Feed';
import { useSystem } from '/src/components/hooks/useSystem';
import { Switch } from '/src/devices/Switch';
import { For, Show } from 'solid-js';

export function App() {
  const { systems, error } = useSystem();

  return (
    <div class="container">
      <header>🏠</header>
      <h1>Home automation</h1>

      <p>This is the home automation app.</p>

      <Show when={!!error()}>
        <div class="error">{error()}</div>
      </Show>

      <div class="devices">
        <For
          each={systems()}
          fallback={
            <p>
              <i>No systems found. Please make sure you have at least one system configured in the manager service.</i>
            </p>
          }
        >
          {system => (
            <div class="device">
              <h3>{system.name}</h3>
              <Show
                when={system.description}
                fallback={
                  <p>
                    <i>No description</i>
                  </p>
                }
              >
                <p>{system.description}</p>
              </Show>
              <For
                each={system.components}
                fallback={
                  <p>
                    <i>No components bound to this system</i>
                  </p>
                }
              >
                {component => (
                  <div class="component">
                    <h4>
                      <b>#</b>
                      {component.id}
                    </h4>
                    <Show when={component.device.type === 'SWITCH'}>
                      <Switch systemId={system.id} component={component} device={component.device} />
                    </Show>
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
      <Feed />
    </div>
  );
}
