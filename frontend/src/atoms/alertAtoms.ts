import { atom } from 'jotai';

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export const alertType = atom<AlertType>('info');
export const alertTitle = atom<string>('');
export const alertMessage = atom<string>('');
export const alertShow = atom<boolean>(false);
export const alertBtnText = atom<string>('Okay');
export const alertOnBtnClick = atom<() => void>();
