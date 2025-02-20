import api, { API_URL } from '../api/api-client.ts';
import { useEffect, useState } from 'react';
import axios, { CanceledError } from 'axios';

const useData = <T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get<T>(`${API_URL}${endpoint}`, {
          signal: controller.signal,
        });

        if (response.data) {
          console.log(response.data);
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
    };

    fetchData();

    return () => controller.abort();
  }, [endpoint]);

  return { data, error, loading };
};

export default useData;
