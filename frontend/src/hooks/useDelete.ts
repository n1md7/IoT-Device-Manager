import api, { API_URL } from '../api/api-client.ts';
import { useCallback, useState } from 'react';
import axios, { CanceledError } from 'axios';

export type ResponseError = {
  statusCode?: number;
  message: string;
  timestamp?: string;
  path?: string;
  details?: string;
};

const UseDelete = <ResponseType>(endpoint: string) => {
  const [data, setData] = useState<ResponseType | null>(null);
  const [error, setError] = useState<ResponseError | null>(null);
  const [loading, setLoading] = useState(false);

  const remove = useCallback(
    async (id: string | number) => {
      setLoading(true);
      try {
        const response = await api.delete<ResponseType>(`${API_URL}${endpoint}/${id}`);
        if (response.data) setData(response.data);
      } catch (err: unknown) {
        if (err instanceof CanceledError || axios.isCancel(err)) return;
        if (axios.isAxiosError(err)) {
          setError(err.response?.data as ResponseError);
        } else if (err instanceof Error) {
          setError({ message: err.message });
        } else {
          setError({ message: 'Error deleting item' });
        }
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  return {
    remove,
    data,
    error,
    loading,
    reset,
  };
};

export default UseDelete;
