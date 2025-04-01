import { SystemPayload, SystemData } from '../types/systemTypes.ts';
import useCreate from './useCreate.ts';
import { useState } from 'react';

const useSystems = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const system = useCreate<SystemPayload, SystemData>('api/v1/systems');

  const addSystem = async (payload: SystemPayload) => {
    setIsSubmitting(true);
    return system.create(payload).finally(() => setIsSubmitting(false));
  };

  return {
    addSystem,
    isSubmitting,
    system,
  };
};

export default useSystems;
