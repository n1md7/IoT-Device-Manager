import { atom } from 'jotai';
import { ComponentsResponseData } from '../types/componentTypes.ts';

export const componentListAtom = atom<ComponentsResponseData>({ components: [], count: 0 });
