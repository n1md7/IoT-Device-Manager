import { useState } from 'react';
import { SchedulePayload, ScheduleData } from '../types/scheduleTypes.ts';
import useCreate from './useCreate.ts';

const useSchedule = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scheduler = useCreate<SchedulePayload, ScheduleData>('/api/v1/scheduler');

  const addSchedule = async (payload: SchedulePayload) => {
    setIsSubmitting(true);
    return scheduler.create(payload).finally(() => setIsSubmitting(false));
  };

  return {
    addSchedule,
    isSubmitting,
    scheduler,
  };
};

export default useSchedule;
