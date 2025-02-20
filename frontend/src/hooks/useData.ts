import { api } from '../api/api-client.ts';
import { Devices } from '../types/deviceTypes.ts';
import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';

const useDevice = () => {
  const [deviceData, setDeviceData] = useState<Devices | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiCall = api.devices.get();

    apiCall.response
      .then((res: AxiosResponse<Devices>) => {
        console.log(res.data);
        setDeviceData(res.data);
        setLoading(false);
      })
      .catch((error: unknown) => {
        console.log('Error fetching devices.', error);
        setError('Failed to fetch devices.');
        setLoading(false);
      });

    return () => {
      apiCall.controller.abort('Abort fetching devices.');
    };
  }, []);

  return { deviceData, loading, error };
};

export default useDevice;
