import useData from './useData.ts';
import { useState } from 'react';
import { ScheduleResponseData, SchedulePayload } from '../types/scheduleTypes.ts';
import { SystemsResponseData } from '../types/systemTypes.ts';

const useSchedule = () => {
  const { data, error, loading, refresh } = useData<ScheduleResponseData>('/api/v1/scheduler');
  const { data: systemList } = useData<SystemsResponseData>('/api/v1/systems');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // add new schedule
  const addSchedule = async (schedule: SchedulePayload) => {
    setIsSubmitting(true);
    console.log('Final Schedule Payload:', schedule);

    try {
      const response = await fetch(`/api/v1/scheduler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule),
      });

      if (!response.ok) throw new Error('Failed to add schedule');

      const result = await response.json();
      await refresh();

      return { success: true, data: result };
    } catch (error) {
      console.error('Error adding schedule', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { scheduleList: data?.schedules || [], systemList, addSchedule, refresh, isSubmitting, error, loading };
};

export default useSchedule;
