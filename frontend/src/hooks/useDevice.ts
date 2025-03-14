import useFetch from './crud/useFetch.ts';
import { DevicesResponseData } from '../types/deviceTypes.ts';
// const fileType = import.meta.env.VITE_TYPE || '';

const useDevice = () => {
  const { data, error, loading } = useFetch<DevicesResponseData>('/api/v1/devices');
  return { deviceList: data, error, loading };
};

export default useDevice;
