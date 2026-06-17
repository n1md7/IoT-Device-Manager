/** Minutes/seconds inputs for the manual auto-off timer. */
export function DurationPicker({
	minutes,
	seconds,
	onMinutes,
	onSeconds,
}: {
	minutes: number;
	seconds: number;
	onMinutes: (value: number) => void;
	onSeconds: (value: number) => void;
}) {
	return (
		<div>
			<div class="row field">
				<div>
					<label for="ctlMin">Minutes</label>
					<input
						type="number"
						id="ctlMin"
						min={0}
						max={999}
						value={minutes}
						onInput={(event) => onMinutes(Number(event.currentTarget.value))}
					/>
				</div>
				<div>
					<label for="ctlSec">Seconds</label>
					<input
						type="number"
						id="ctlSec"
						min={0}
						max={59}
						value={seconds}
						onInput={(event) => onSeconds(Number(event.currentTarget.value))}
					/>
				</div>
			</div>
			<p class="muted">
				Minimum duration is 10 seconds. The device turns the switch off automatically when it
				elapses.
			</p>
		</div>
	);
}
