import useData from './useData.ts';
import { ScheduleResponseData } from '../types/scheduleTypes.ts';

const useSchedule = () => {
  const { data, error, loading } = useData<ScheduleResponseData>('/api/v1/scheduler');
  return { scheduleList: data, error, loading };
};

export default useSchedule;
