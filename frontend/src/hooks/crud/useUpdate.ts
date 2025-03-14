import { SchedulePayload } from '../../types/scheduleTypes.ts';
import { useState } from 'react';

const useUpdate = <ResponseType>(endpoint: string) => {
  const [updating, setUpdating] = useState<boolean>(false);
  // TODO: Implement this hook
  return {
    updating,
    updateById: async (payload: SchedulePayload) => {},
  };
};

export default useUpdate;
