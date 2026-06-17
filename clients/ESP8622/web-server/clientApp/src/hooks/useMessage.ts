import { useCallback, useState } from 'preact/hooks';
import { noMessage, type MessageState } from '../components/Message';

/**
 * Status-line state for a `<Message />` slot, plus the small set of transitions
 * every form repeats: clear it, show an error, show success, or run an async
 * action and surface its failure. Centralising this keeps the try/catch +
 * `setMessage` boilerplate out of components.
 */
export function useMessage() {
	const [message, setMessage] = useState<MessageState>(noMessage);

	const clear = useCallback(() => setMessage(noMessage), []);
	const fail = useCallback(
		(error: unknown) => setMessage({ text: (error as Error).message, kind: 'err' }),
		[],
	);
	const succeed = useCallback((text: string) => setMessage({ text, kind: 'ok' }), []);

	/** Run `action`, returning whether it succeeded; failures land in the message. */
	const run = useCallback(
		async (action: () => Promise<void>): Promise<boolean> => {
			try {
				await action();
				return true;
			} catch (error) {
				fail(error);
				return false;
			}
		},
		[fail],
	);

	return { message, setMessage, clear, fail, succeed, run };
}
