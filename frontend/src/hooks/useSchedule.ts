import { useState } from 'react';
import { SchedulePayload, ScheduleData, ScheduleResponseData } from '../types/scheduleTypes.ts';
import useCreate from './useCreate.ts';
import useData from './useData.ts';

const useSchedule = () => {
  const [isPending, setIsPending] = useState(false);
  const apiCreate = useCreate<SchedulePayload, ScheduleData>('/api/v1/scheduler');
  const apiFetch = useData<ScheduleResponseData>('/api/v1/scheduler');

  const create = async (payload: SchedulePayload) => {
    setIsPending(true);
    return apiCreate.create(payload).finally(() => setIsPending(false));
  };

  const fetchAll = async () => {};

  return {
    addSchedule,
    isSubmitting,
    scheduler,
  };
};

export default useSchedule;
