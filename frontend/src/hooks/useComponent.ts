import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import useCreate from '@src/hooks/common/useCreate';
import useFetch from '@src/hooks/common/useFetch';
import useDelete from '@src/hooks/common/useDelete';
import useUpdate from '@src/hooks/common/useUpdate';
import { componentListAtom } from '@src/atoms/listAtom';
import { ComponentPayloadData, ComponentsData, ComponentsResponseData } from '@src/types/componentTypes';

const useComponent = () => {
  const endpoint = '/api/v1/components';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [componentList, setComponentList] = useAtom(componentListAtom);
  const [updatedItem, setUpdatedItem] = useState<string | null>();
  const [deletedItem, setDeletedItem] = useState<string | null>();
  const { data, error, loading, refresh } = useFetch<ComponentsResponseData>(endpoint);
  const { remove, error: deletingError, reset: deleteReset } = useDelete<ComponentsData>(endpoint);
  const { update, error: updatingError, loading: updating } = useUpdate<ComponentPayloadData, ComponentsData>(endpoint);
  const component = useCreate<ComponentPayloadData, ComponentsData>(endpoint);

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

  const updateComponent = async (id: number, payload: ComponentPayloadData, component: string) => {
    return update(id, payload).then(() => {
      setUpdatedItem(component);
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
    updateComponent,
    reset,
    isSubmitting,
    componentList,
    component,
    loading,
    error,
    deletingError,
    deletedItem,
    updatingError,
    updatedItem,
    updating,
  };
};

export default useComponent;
