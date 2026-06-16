/** Status line — `kind` is "ok" | "err" | "". Renders a stable-height slot. */
export type MessageKind = '' | 'ok' | 'err';

export interface MessageState {
	text: string;
	kind: MessageKind;
}

export const noMessage: MessageState = { text: '', kind: '' };

export function Message({ text, kind }: MessageState) {
	return <div class={`msg ${kind}`.trim()}>{text}</div>;
}
