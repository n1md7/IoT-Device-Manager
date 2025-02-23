import useData from './useData.ts';
import { DevicesResponseData } from '../types/deviceTypes.ts';
const fileType = import.meta.env.VITE_TYPE || '';

const useDevice = () => {
  const { data, error, loading } = useData<DevicesResponseData>('/api/v1/devices' + fileType);
  return { deviceList: data, error, loading };
};

export default useDevice;
