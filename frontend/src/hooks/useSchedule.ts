import { useEffect, useState } from 'react';
import useCreate from '@src/hooks/useCreate';
import useData from '@src/hooks/useData';
import useDelete from '@src/hooks/useDelete';
import { useAtom } from 'jotai';
import { scheduleListAtom } from '@src/atoms/listAtom';
import { SchedulePayload, ScheduleData, ScheduleResponseData } from '@src/types/scheduleTypes';

const useSchedule = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleList, setScheduleList] = useAtom(scheduleListAtom);
  const { data, loading, refresh, error } = useData<ScheduleResponseData>('/api/v1/scheduler');
  const scheduler = useCreate<SchedulePayload, ScheduleData>('/api/v1/scheduler');
  const { remove, error: deletingError, reset: deleteReset } = useDelete<SchedulePayload>('/api/v1/scheduler');
  const [deletedItem, setDeletedItem] = useState<string | null>();

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

  const removeSchedule = async (id: number, schedule: string) => {
    return remove(id).then(() => {
      setDeletedItem(schedule);
      return refresh().finally(() => {
        setIsSubmitting(false);
      });
    });
  };

  const reset = () => {
    deleteReset();
    setDeletedItem(null);
  };

  useEffect(() => {
    if (data) setScheduleList(data);
  }, [data, setScheduleList]);

  return {
    addSchedule,
    removeSchedule,
    reset,
    isSubmitting,
    scheduler,
    scheduleList,
    loading,
    error,
    deletedItem,
    deletingError,
  };
};

export default useSchedule;
