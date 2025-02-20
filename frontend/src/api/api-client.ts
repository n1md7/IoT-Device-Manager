import axios, { AxiosResponse } from 'axios';
import { DeviceResponseType, DeviceType } from '../types/deviceTypes.ts';

export const API_URL = import.meta.env.VITE_API_BASE_URL;

const fetchWithAbort = <T>(url: string) => {
  const controller = new AbortController();
  const response: Promise<AxiosResponse<T>> = axios.get<T>(url, {
    signal: controller.signal,
  });

  return { response, controller };
};

export const api = {
  devices: {
    get(): {
      response: Promise<AxiosResponse<DeviceResponseType>>; controller: AbortController } {
      return fetchWithAbort<DeviceResponseType>(`${API_URL}/api/v1/devices`)
    },
  },
};
