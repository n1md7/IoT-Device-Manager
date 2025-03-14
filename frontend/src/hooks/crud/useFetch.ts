import api from '../../api/api-client.ts';
import { useCallback, useState } from 'react';
import axios, { CanceledError } from 'axios';
import { ResponseError } from './useCreate.ts';

const useFetch = <ResponseType>(endpoint: string) => {
  const [data, setData] = useState<ResponseType | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<ResponseError | null>(null);

  const fetch = useCallback(
    (id?: number) => {
      const controller = new AbortController();
      const signal = controller.signal;

      setFetching(true);
      setFetchError(null);

      const path = Number.isFinite(id) ? `${endpoint}/${id}` : endpoint;
      api
        .get<ResponseType>(path, {
          signal,
        })
        .then((response) => {
          if (response.data) {
            setData(response.data);
            setFetchError(null);
          }
        })
        .catch((err: unknown) => {
          if (err instanceof CanceledError) return;
          if (axios.isCancel(err)) return;
          if (axios.isAxiosError(err)) {
            setFetchError(err.response?.data as ResponseError);
          } else if (err instanceof Error) {
            setFetchError({ message: err.message });
          } else {
            setFetchError({ message: 'Unknown error occurred.' });
          }
        })
        .finally(() => setFetching(false));

      return {
        abort: () => controller.abort(),
      };
    },
    [endpoint],
  );

  const fetchAll = () => fetch();

  const fetchById = (id: number) => fetch(id);

  return {
    data,
    fetchError,
    fetching,
    fetchAll,
    fetchById,
  };
};

export default useFetch;
