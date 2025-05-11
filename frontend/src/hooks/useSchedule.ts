import { useEffect, useState } from 'react';
import useCreate from '@src/hooks/common/useCreate';
import useFetch from '@src/hooks/common/useFetch';
import useDelete from '@src/hooks/common/useDelete';
import { useAtom } from 'jotai';
import { scheduleListAtom } from '@src/atoms/listAtom';
import { SchedulePayload, ScheduleData, ScheduleResponseData } from '@src/types/scheduleTypes';
import useUpdate from '@src/hooks/common/useUpdate';

const useSchedule = () => {
  const endpoint = '/api/v1/scheduler';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleList, setScheduleList] = useAtom(scheduleListAtom);
  const { data, loading, refresh, error } = useFetch<ScheduleResponseData>(endpoint);
  const scheduler = useCreate<SchedulePayload, ScheduleData>(endpoint);
  const { update, error: updatingError, loading: updating } = useUpdate<SchedulePayload, ScheduleData>(endpoint);
  const { remove, error: deletingError, reset: deleteReset } = useDelete<SchedulePayload>(endpoint);
  const [deletedItem, setDeletedItem] = useState<string | null>();
  const [updatedItem, setUpdatedItem] = useState<string | null>();

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

  const updateSchedule = async (id: number, payload: SchedulePayload, schedule: string) => {
    return update(id, payload).then(() => {
      setUpdatedItem(schedule);
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
    updateSchedule,
    reset,
    isSubmitting,
    scheduler,
    scheduleList,
    loading,
    error,
    deletedItem,
    deletingError,
    updatedItem,
    updatingError,
    updating,
  };
};

export default useSchedule;
