import { SystemPayload, SystemData, SystemsResponseData } from '../types/systemTypes.ts';
import useCreate from './useCreate.ts';
import { useState } from 'react';
import useData from './useData.ts';

const useSystems = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const system = useCreate<SystemPayload, SystemData>('/api/v1/systems/create');
  const systemList = useData<SystemsResponseData>('/api/v1/systems');

  const addSystem = async (payload: SystemPayload) => {
    setIsSubmitting(true);
    return system.create(payload).finally(() => setIsSubmitting(false));
  };

  return {
    addSystem,
    isSubmitting,
    system,
    systemList,
  };
};

export default useSystems;
