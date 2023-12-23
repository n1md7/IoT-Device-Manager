import { DeviceStatus } from '/src/devices/enums/status.enum';

export type DeviceOnMessage = {
  status: DeviceStatus.ON;
  time: {
    min: number;
    sec: number;
  };
};

export type DeviceOffMessage = {
  status: DeviceStatus.OFF;
};

export type DeviceControlMessageType = DeviceOnMessage | DeviceOffMessage;
