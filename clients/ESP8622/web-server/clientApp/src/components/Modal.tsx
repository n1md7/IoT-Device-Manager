import { useEffect } from 'preact/hooks';
import { closeModal, modalState } from '../store/modal';

/** Reusable confirm dialog, driven by the modal store's `confirm()`. */
export function Modal() {
	const state = modalState.value;

	useEffect(() => {
		if (!state) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') closeModal(false);
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [state]);

	if (!state) return null;

	return (
		<div
			class="modal-backdrop"
			role="dialog"
			aria-modal="true"
			onClick={(event) => {
				if (event.target === event.currentTarget) closeModal(false);
			}}
		>
			<div class="modal">
				<h3>{state.heading}</h3>
				<p>{state.message}</p>
				<div class="btns">
					<button class="action ghost" type="button" onClick={() => closeModal(false)}>
						Cancel
					</button>
					<button
						class={`action ${state.danger ? 'danger' : ''}`.trim()}
						type="button"
						// eslint-disable-next-line
						ref={(el) => el?.focus()}
						onClick={() => closeModal(true)}
					>
						{state.okText}
					</button>
				</div>
			</div>
		</div>
	);
}
