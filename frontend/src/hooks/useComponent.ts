import { ComponentPayloadData, ComponentsData } from '../types/componentTypes.ts';
import useCreate from './useCreate.ts';
import { useState } from 'react';

const useComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const component = useCreate<ComponentPayloadData, ComponentsData>('/api/v1/components');

  const addComponent = async (payload: ComponentPayloadData) => {
    setIsSubmitting(true);
    return component.create(payload).finally(() => setIsSubmitting(false));
  };

  return {
    addComponent,
    isSubmitting,
    component,
  };
};

export default useComponent;
