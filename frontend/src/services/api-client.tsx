import axios from 'axios';

type DeviceType = {
  code: string;
  type: string;
  name: string;
  description: string | null;
  version: string;
  createdAt: string;
  updatedAt: string;
};

type DeviceResponseType = {
  count: number;
  devices: DeviceType[];
};

export const API_URL = import.meta.env.VITE_API_BASE_URL;
export const api = {
  devices: {
    get() {
      return axios.get<DeviceResponseType>(`${API_URL}/api/v1/devices`);
    },
    getWithAbort() {
      const controller = new AbortController();
      const response = axios.get<DeviceResponseType>(`${API_URL}/api/v1/devices`, controller);

      return {
        response,
        controller,
      };
    },
  },
  component: {
    get() {},
    create(device: DeviceType) {},
  },
};
