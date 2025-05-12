import { atom } from 'jotai';
import { ComponentsResponseData } from '../types/componentTypes.ts';
import { SystemsResponseData } from '../types/systemTypes.ts';
import { DevicesResponseData } from '../types/deviceTypes.ts';
import { ScheduleResponseData } from '../types/scheduleTypes.ts';

export const componentListAtom = atom<ComponentsResponseData>({ components: [], count: 0 });
export const systemListAtom = atom<SystemsResponseData>({ systems: [], count: 0 });
export const deviceListAtom = atom<DevicesResponseData>({ devices: [], count: 0 });
export const scheduleListAtom = atom<ScheduleResponseData>({ schedules: [], count: 0 });

scheduleListAtom.debugLabel = 'Schedule List';
