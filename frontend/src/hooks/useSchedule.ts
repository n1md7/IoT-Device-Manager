import useData from './useData.ts';
import { useState } from 'react';
import { ScheduleData, ScheduleResponseData } from '../types/scheduleTypes.ts';
import { SystemsResponseData } from '../types/systemTypes.ts';

const useSchedule = () => {
  const { data, error, loading, refresh } = useData<ScheduleResponseData>('/api/v1/scheduler');
  const { data: systemList } = useData<SystemsResponseData>('/api/v1/systems');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextSystemId = data?.schedules.length ? Math.max(...data.schedules.map((s) => s.id)) + 1 : 1; // increments system id

  // add new schedule
  const addSchedule = async (schedule: Omit<ScheduleData, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);

    const newSchedule: ScheduleData = {
      id: nextSystemId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...schedule, // does this mean others are declared in tsx?
    };
    console.log('Final Schedule Payload:', newSchedule);

    try {
      const response = await fetch(`/api/v1/scheduler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule),
      });

      if (!response.ok) throw new Error('Failed to add schedule');

      await refresh();
    } catch (error) {
      console.error('Error adding schedule', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { scheduleList: data?.schedules || [], systemList, nextSystemId, addSchedule, isSubmitting, error, loading };
};

export default useSchedule;
