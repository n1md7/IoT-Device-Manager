import { useEffect, useState } from 'react';
import { SchedulePayload, ScheduleData, ScheduleResponseData } from '../types/scheduleTypes.ts';
import useCreate from './useCreate.ts';
import useData from './useData.ts';
import { useAtom } from 'jotai';
import { scheduleListAtom } from '../atoms/listAtom.ts';
import useDelete from './useDelete.ts';

const useSchedule = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleList, setScheduleList] = useAtom(scheduleListAtom);
  const { data, loading, refresh, error } = useData<ScheduleResponseData>('/api/v1/scheduler');
  const scheduler = useCreate<SchedulePayload, ScheduleData>('/api/v1/scheduler');
  const item = useDelete<SchedulePayload>('/api/v1/scheduler');

  const addSchedule = async (payload: SchedulePayload) => {
    const clickedAt = new Date();
    const awaitFor = 1500;
    setIsSubmitting(true);

    return scheduler.create(payload).finally(async () => {
      const response = await refresh();
      const delta = new Date().getTime() - clickedAt.getTime();

      if (response?.data) setScheduleList(response.data);
      if (awaitFor <= delta) setIsSubmitting(false);
      else {
        setTimeout(() => setIsSubmitting(false), awaitFor - delta);
      }
    });
  };

  const removeSchedule = async (id: number) => {
    return item.remove(id).finally(async () => {
      const response = await refresh();

      if (response?.data) setScheduleList(response.data);
      setIsSubmitting(false);
    });
  };

  useEffect(() => {
    if (data) setScheduleList(data);
  }, [data, setScheduleList]);

  return {
    addSchedule,
    removeSchedule,
    isSubmitting,
    scheduler,
    scheduleList,
    loading,
    error,
  };
};

export default useSchedule;
