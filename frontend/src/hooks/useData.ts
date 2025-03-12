import api, { API_URL } from '../api/api-client.ts';
import { useCallback, useEffect, useState } from 'react';
import axios, { CanceledError } from 'axios';

const useData = <T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<T>(`${API_URL}${endpoint}`);
      if (response.data) {
        setData(response.data);
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

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      await fetchData();
    })();

    return () => controller.abort();
  }, [fetchData]);

  return { data, error, loading, refresh: fetchData };
};

export default useData;
