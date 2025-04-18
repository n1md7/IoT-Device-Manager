import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import useData from './useData.ts';
import useCreate from './useCreate.ts';
import { deviceListAtom } from '../atoms/listAtom.ts';
import { DeviceDetails, DevicePayloadData, DevicesResponseData } from '../types/deviceTypes.ts';

const useDevice = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deviceList, setDeviceList] = useAtom(deviceListAtom);
  const { data, error, loading, refresh } = useData<DevicesResponseData>('/api/v1/devices');
  const device = useCreate<DevicePayloadData, DeviceDetails>('/api/v1/devices/create');

  const addDevice = async (payload: DevicePayloadData) => {
    const clickedAt = new Date();
    const awaitFor = 1500;
    setIsSubmitting(true);

    return device.create(payload).finally(async () => {
      const response = await refresh();
      const delta = new Date().getTime() - clickedAt.getTime();

      if (response?.data) setDeviceList(response.data);
      if (awaitFor <= delta) setIsSubmitting(false);
      else {
        setTimeout(() => setIsSubmitting(false), awaitFor - delta);
      }
    });
  };

  useEffect(() => {
    if (data) setDeviceList(data);
  }, [data, setDeviceList]);

  return {
    addDevice,
    isSubmitting,
    device,
    deviceList,
    loading,
    error,
  };
};

export default useDevice;
