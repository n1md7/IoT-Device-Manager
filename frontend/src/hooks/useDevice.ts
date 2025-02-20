import useData from './useData.ts';
import { DevicesResponseData } from '../types/deviceTypes.ts';

const useDevice = () => {
  const { data, error, loading } = useData<DevicesResponseData>('/api/v1/devices');
  return { deviceList: data, error, loading };
};

export default useDevice;
