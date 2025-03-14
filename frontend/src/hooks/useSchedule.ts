import { SchedulePayload, ScheduleData, ScheduleResponseData } from '../types/scheduleTypes.ts';
import { useEffect, useState } from 'react';
import useCreate, { ResponseError } from './crud/useCreate.ts';
import useFetch from './crud/useFetch.ts';
import useUpdate from './crud/useUpdate.ts';
import useRemove from './crud/useRemove.ts';

const useSchedule = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ResponseError | null>(null);
  const { create, creating, createError } = useCreate<SchedulePayload, ScheduleData>('/api/v1/scheduler');
  const { fetchById, fetchAll, fetching, fetchError } = useFetch<ScheduleResponseData>('/api/v1/scheduler');
  const { updateById, updating } = useUpdate<ScheduleResponseData>('/api/v1/scheduler');
  const { removing, removeById } = useRemove('/api/v1/scheduler');

  useEffect(() => {
    setIsPending(creating || fetching || updating || removing);
  }, [creating, fetching, updating, removing]);

  useEffect(() => {
    setError(createError || fetchError || null);
  }, [createError, fetchError]);

  return {
    create,
    fetchAll,
    fetchById,
    removeById,
    updateById,
    isPending,
    error,
  };
};

export default useSchedule;
