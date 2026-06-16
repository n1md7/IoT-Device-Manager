/**
 * Modal store — promise-based confirm dialog (replaces window.confirm).
 * `confirm()` opens the dialog and resolves to true (confirm) or false
 * (cancel/dismiss). A single `<Modal />` mounted in the app renders the state.
 */
import { signal } from '@preact/signals';

export interface ConfirmOptions {
	heading?: string;
	okText?: string;
	danger?: boolean;
}

interface ModalState extends Required<ConfirmOptions> {
	message: string;
	resolve: (result: boolean) => void;
}

export const modalState = signal<ModalState | null>(null);

/** Show the dialog and resolve to true (confirm) or false (cancel/dismiss). */
export const confirm = (message: string, options: ConfirmOptions = {}): Promise<boolean> =>
	new Promise((resolve) => {
		modalState.value = {
			message,
			heading: options.heading ?? 'Please confirm',
			okText: options.okText ?? 'Confirm',
			danger: options.danger ?? true,
			resolve,
		};
	});

/** Close the dialog and settle the pending promise. */
export const closeModal = (result: boolean): void => {
	const state = modalState.value;
	modalState.value = null;
	state?.resolve(result);
};
