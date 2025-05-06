import api, { API_URL } from '@src/api/api-client.ts';
import { useCallback, useState } from 'react';
import axios, { CanceledError } from 'axios';

export type ResponseError = {
  statusCode?: number;
  message: string;
  timestamp?: string;
  path?: string;
  details?: string;
};

const useCreate = <PayloadType, ResponseType>(endpoint: string) => {
  const [data, setData] = useState<ResponseType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ResponseError | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const create = useCallback(
    async (payload: PayloadType) => {
      setLoading(true);
      try {
        const response = await api.post<ResponseType>(`${API_URL}${endpoint}`, payload);
        if (response.status) setStatusCode(response.status);
        if (response.data) setData(response.data);
      } catch (err: unknown) {
        if (err instanceof CanceledError || axios.isCancel(err)) return;
        if (axios.isAxiosError(err)) {
          setError(err.response?.data as ResponseError);
        } else if (err instanceof Error) {
          setError({ message: err.message });
        } else {
          setError({ message: 'Unknown error occurred.' });
        }
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  return {
    data,
    error,
    loading,
    create,
    statusCode,
  };
};

export default useCreate;
