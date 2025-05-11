import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import useFetch from '@src/hooks/common/useFetch';
import useCreate from '@src/hooks/common/useCreate';
import { deviceListAtom } from '@src/atoms/listAtom';
import { DeviceDetails, DevicePayloadData, DevicesResponseData } from '@src/types/deviceTypes';
import useUpdate from '@src/hooks/common/useUpdate';

const useDevice = () => {
  const endpoint = '/api/v1/devices';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deviceList, setDeviceList] = useAtom(deviceListAtom);
  const [updatedItem, setUpdatedItem] = useState<string | null>();
  const { data, error, loading, refresh } = useFetch<DevicesResponseData>(endpoint);
  const { update, error: updatingError, loading: updating } = useUpdate<DevicePayloadData, DeviceDetails>(endpoint + '/update');
  const device = useCreate<DevicePayloadData, DeviceDetails>(endpoint);

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

  const updateDevice = async (id: string, payload: DevicePayloadData, device: string) => {
    return update(id, payload).then(() => {
      setUpdatedItem(device);
      return refresh().finally(() => {
        setIsSubmitting(false);
      });
    });
  };

  useEffect(() => {
    if (data) setDeviceList(data);
  }, [data, setDeviceList]);

  return {
    addDevice,
    updateDevice,
    isSubmitting,
    device,
    deviceList,
    loading,
    error,
    updatingError,
    updatedItem,
    updating,
  };
};

export default useDevice;
