import { isOn, setIsOn } from '/src/stores/pump.store';

export function WaterPump() {
  const onPayload = {
    code: 'D0001',
    status: 'ON',
    minutes: 10,
    seconds: 30,
  };
  const offPayload = {
    code: 'D0001',
    status: 'OFF',
  };
  const handleClick = () => {
    setIsOn(!isOn());

    fetch('/api/v1/timer/control', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(!isOn() ? offPayload : onPayload),
    }).catch(console.error);
  };

  return (
    <div>
      <h2>
        Water Pump: {isOn() ? <span style={{ color: 'green' }}>ON</span> : <span style={{ color: 'red' }}>OFF</span>}
      </h2>
      <button class="toggle" onClick={handleClick}>
        Turn {!isOn() ? <span style={{ color: 'green' }}>on</span> : <span style={{ color: 'red' }}>off</span>}
      </button>
    </div>
  );
}
