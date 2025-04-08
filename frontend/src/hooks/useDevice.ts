import useData from './useData.ts';
import { DeviceDetails, DevicePayloadData, DevicesResponseData } from '../types/deviceTypes.ts';
import useCreate from './useCreate.ts';
import { useState } from 'react';

const useDevice = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const deviceList = useData<DevicesResponseData>('/api/v1/devices');
  const device = useCreate<DevicePayloadData, DeviceDetails>('/api/v1/devices/create');

  const addDevice = async (payload: DevicePayloadData) => {
    setIsSubmitting(true);
    return device.create(payload).finally(() => setIsSubmitting(false));
  };

  return {
    addDevice,
    isSubmitting,
    device,
    deviceList,
  };
};

export default useDevice;
