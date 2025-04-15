import { ComponentPayloadData, ComponentsData, ComponentsResponseData } from '../types/componentTypes.ts';
import useCreate from './useCreate.ts';
import { useEffect, useState } from 'react';
import useData from './useData.ts';
import { useAtom } from 'jotai';
import { componentListAtom } from '../atoms/listAtom.ts';

const useComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [componentList, setComponentList] = useAtom(componentListAtom);
  const { data, error, loading, refresh } = useData<ComponentsResponseData>('/api/v1/components');
  const component = useCreate<ComponentPayloadData, ComponentsData>('/api/v1/components');

  const addComponent = async (payload: ComponentPayloadData) => {
    const clickedAt = new Date();
    const awaitFor = 1500;
    setIsSubmitting(true);
    return component.create(payload).finally(async () => {
      const response = await refresh();
      if (response?.data) setComponentList(response.data);
      const delta = new Date().getTime() - clickedAt.getTime();
      if (awaitFor <= delta) setIsSubmitting(false);
      else {
        setTimeout(() => setIsSubmitting(false), awaitFor - delta);
      }
    });
  };

  useEffect(() => {
    if (data) {
      setComponentList(data);
    }
  }, [data, setComponentList]);

  return {
    addComponent,
    isSubmitting,
    component,
    loading,
    error,
    componentList,
  };
};

export default useComponent;
