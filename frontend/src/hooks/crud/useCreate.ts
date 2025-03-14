import api from '../../api/api-client.ts';
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
  const [creating, setCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<ResponseError | null>(null);

  const create = useCallback(
    async (payload: PayloadType) => {
      const controller = new AbortController();
      const signal = controller.signal;

      setCreateError(null);
      setCreating(true);
      try {
        const response = await api.post<ResponseType>(`${endpoint}`, payload, { signal });
        if (response.data) {
          setData(response.data);
        }
      } catch (err: unknown) {
        if (err instanceof CanceledError) return;
        if (axios.isCancel(err)) return;
        if (axios.isAxiosError(err)) {
          setCreateError(err.response?.data as ResponseError);
        } else if (err instanceof Error) {
          setCreateError({
            message: err.message,
          });
        } else {
          setCreateError({ message: 'Unknown error occurred.' });
        }
      } finally {
        setCreating(false);
      }

      return {
        abort: () => controller.abort(),
      };
    },
    [endpoint],
  );

  return {
    data,
    createError,
    creating,
    create,
  };
};

export default useCreate;
