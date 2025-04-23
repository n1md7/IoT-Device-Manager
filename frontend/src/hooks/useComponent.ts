import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import useCreate from './useCreate.ts';
import useData from './useData.ts';
import { componentListAtom } from '../atoms/listAtom.ts';
import { ComponentPayloadData, ComponentsData, ComponentsResponseData } from '../types/componentTypes.ts';
import useDelete from './useDelete.ts';

const useComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [componentList, setComponentList] = useAtom(componentListAtom);
  const { data, error, loading, refresh } = useData<ComponentsResponseData>('/api/v1/components');
  const component = useCreate<ComponentPayloadData, ComponentsData>('/api/v1/components');
  const item = useDelete<ComponentsData>('/api/v1/components');

  const addComponent = async (payload: ComponentPayloadData) => {
    const clickedAt = new Date();
    const awaitFor = 1500;
    setIsSubmitting(true);

    return component.create(payload).finally(async () => {
      const response = await refresh();
      const delta = new Date().getTime() - clickedAt.getTime();

      if (response?.data) setComponentList(response.data);
      if (awaitFor <= delta) setIsSubmitting(false);
      else {
        setTimeout(() => setIsSubmitting(false), awaitFor - delta);
      }
    });
  };

  const removeComponent = async (id: string | number) => {
    console.log('deleting component ', id);
    return item.remove(id).finally(async () => {
      console.log('deleted component ', id);
      const response = await refresh();

      if (response?.data) setComponentList(response.data);
      setIsSubmitting(false);
    });
  };

  useEffect(() => {
    if (data) setComponentList(data);
  }, [data, setComponentList]);

  return {
    addComponent,
    isSubmitting,
    component,
    loading,
    error,
    componentList,
    removeComponent,
  };
};

export default useComponent;
