import { atom } from 'jotai';
import { ComponentsResponseData } from '../types/componentTypes.ts';
import { SystemsResponseData } from '../types/systemTypes.ts';

export const componentListAtom = atom<ComponentsResponseData>({ components: [], count: 0 });
export const systemListAtom = atom<SystemsResponseData>({ systems: [], count: 0 });
