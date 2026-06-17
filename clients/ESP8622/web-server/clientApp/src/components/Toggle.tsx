/** A slider-style on/off switch — a styled checkbox with an optional label. */
export function Toggle({
	checked,
	onChange,
	label,
}: {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
}) {
	return (
		<label class="toggle">
			<input
				type="checkbox"
				checked={checked}
				onChange={(event) => onChange(event.currentTarget.checked)}
			/>
			<span class="toggle-track" aria-hidden="true" />
			{label && <span class="toggle-label">{label}</span>}
		</label>
	);
}
