import { ComponentPayloadData, ComponentsData, ComponentsResponseData } from '../types/componentTypes.ts';
import useCreate from './useCreate.ts';
import { useState } from 'react';
import useData from './useData.ts';

const useComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const component = useCreate<ComponentPayloadData, ComponentsData>('/api/v1/components');
  const componentList = useData<ComponentsResponseData>('/api/v1/components');

  const addComponent = async (payload: ComponentPayloadData) => {
    setIsSubmitting(true);
    return component.create(payload).finally(() => setIsSubmitting(false));
  };

  return {
    addComponent,
    isSubmitting,
    component,
    componentList,
  };
};

export default useComponent;
