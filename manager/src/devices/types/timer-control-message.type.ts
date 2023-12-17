import { DeviceStatus } from '/src/devices/enums/status.enum';

type DeviceOnMessage = {
  status: DeviceStatus.ON;
  time: {
    min: number;
    sec: number;
  };
};

type DeviceOffMessage = {
  status: DeviceStatus.OFF;
};

export type TimerControlMessageType = DeviceOnMessage | DeviceOffMessage;
