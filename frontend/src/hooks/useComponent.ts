import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import useCreate from '@src/hooks/useCreate';
import useData from '@src/hooks/useData';
import useDelete from '@src/hooks/useDelete';
import { componentListAtom } from '@src/atoms/listAtom';
import { ComponentPayloadData, ComponentsData, ComponentsResponseData } from '@src/types/componentTypes';

const useComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [componentList, setComponentList] = useAtom(componentListAtom);
  const { data, error, loading, refresh } = useData<ComponentsResponseData>('/api/v1/components');
  const { remove, error: deletingError, reset: deleteReset } = useDelete<ComponentsData>('/api/v1/components');
  const component = useCreate<ComponentPayloadData, ComponentsData>('/api/v1/components');
  const [deletedItem, setDeletedItem] = useState<string | null>();

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

  const removeComponent = async (id: number, component: string) => {
    return remove(id).then(() => {
      setDeletedItem(component);
      return refresh().finally(() => {
        setIsSubmitting(false);
      });
    });
  };

  const reset = () => {
    deleteReset();
    setDeletedItem(null);
  };

  useEffect(() => {
    if (data) setComponentList(data);
  }, [data, setComponentList]);

  return {
    addComponent,
    removeComponent,
    reset,
    isSubmitting,
    componentList,
    component,
    loading,
    error,
    deletingError,
    deletedItem,
  };
};

export default useComponent;
