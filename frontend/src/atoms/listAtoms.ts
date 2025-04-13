import { atom } from 'jotai';
import { ComponentsResponseData } from '../types/componentTypes';

export const componentListAtom = atom<ComponentsResponseData | null>(null);
