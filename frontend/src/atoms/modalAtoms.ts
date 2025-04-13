import { atom } from 'jotai';

export type ModalType = 'component' | 'device' | 'schedule' | 'system';

export const modalType = atom<ModalType>();
