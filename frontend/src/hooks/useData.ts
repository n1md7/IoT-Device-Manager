import api from '../api/api-client.ts';
import { useCallback, useState } from 'react';
import axios, { CanceledError } from 'axios';

const useData = <ResponseType>(endpoint: string) => {
  const [data, setData] = useState<ResponseType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const signal = controller.signal;

      const response = await api.get<ResponseType>(`${endpoint}`, {
        signal,
      });
      if (response.data) {
        setData(response.data);
        setError('');
      }
    } catch (err: unknown) {
      if (err instanceof CanceledError) return;
      if (axios.isCancel(err)) return;
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return {
    data,
    error,
    loading,
    fetch,
  };
};

export default useData;
