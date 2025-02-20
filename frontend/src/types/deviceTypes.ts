export type DeviceType = {
  code: string;
  type: string;
  name: string;
  description: string | null;
  version: string;
  createdAt: string;
  updatedAt: string;
};

export type DeviceResponseType = {
  count: number;
  devices: DeviceType[];
};
