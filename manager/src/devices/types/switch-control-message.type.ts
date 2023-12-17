import { DeviceStatus } from '/src/devices/enums/status.enum';

type DeviceOnMessage = {
  status: DeviceStatus.ON;
};

type DeviceOffMessage = {
  status: DeviceStatus.OFF;
};

export type SwitchControlMessageType = DeviceOnMessage | DeviceOffMessage;
