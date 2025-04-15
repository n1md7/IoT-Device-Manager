import { atom } from 'jotai';

export const isFailedAtom = atom(false);
export const isSuccessAtom = atom(false);
export const errorDetailsAtom = atom<string | null>(null);
export const errorMessageAtom = atom<string | null>(null);
