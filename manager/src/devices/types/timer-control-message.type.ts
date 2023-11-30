import { TimerStatus } from '/src/devices/enums/status.enum';

type DeviceOnMessage = {
  status: TimerStatus.ON;
  time: {
    min: number;
    sec: number;
  };
};

type DeviceOffMessage = {
  status: TimerStatus.OFF;
};

export type TimerControlMessageType = DeviceOnMessage | DeviceOffMessage;
