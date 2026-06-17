import { device, deviceOffline } from '../store/device';
import { useDeviceClock } from '../hooks/useDeviceClock';
import { MONTHS, pad, WEEKDAYS } from '../utils/format';

/** Footer with a device-anchored clock that ticks off the browser. */
export function Footer() {
	const now = useDeviceClock();

	const info = device.value;
	const meta = deviceOffline.value
		? 'device offline'
		: [info?.code, info?.version && `v${info.version}`].filter(Boolean).join(' · ');

	return (
		<footer>
			<div class="footer-clock">
				{pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
			</div>
			<div class="footer-date">
				{WEEKDAYS[now.getDay()]}, {now.getDate()} {MONTHS[now.getMonth()]} {now.getFullYear()}
			</div>
			<div class="footer-meta">{meta}</div>
			<div class="footer-credit">
				Powered by <b>GG-Software</b> · ESP8266
			</div>
		</footer>
	);
}
