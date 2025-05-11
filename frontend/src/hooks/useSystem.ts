import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import useCreate from '@src/hooks/common/useCreate';
import useDelete from '@src/hooks/common/useDelete';
import useFetch from '@src/hooks/common/useFetch';
import useUpdate from '@src/hooks/common/useUpdate';
import { systemListAtom } from '@src/atoms/listAtom';
import { SystemPayload, SystemData, SystemsResponseData } from '@src/types/systemTypes';

const useSystems = () => {
  const endpoint = '/api/v1/systems';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [systemList, setSystemList] = useAtom(systemListAtom);
  const [deletedItem, setDeletedItem] = useState<string | null>();
  const [updatedItem, setUpdatedItem] = useState<string | null>();
  const { data, error, loading, refresh } = useFetch<SystemsResponseData>(endpoint);
  const { update, error: updatingError, loading: updating } = useUpdate<SystemPayload, SystemData>(endpoint);
  const { remove, error: deletingError, reset: deleteReset } = useDelete<SystemsResponseData>(endpoint);
  const system = useCreate<SystemPayload, SystemData>(endpoint + '/create');

  const addSystem = async (payload: SystemPayload) => {
    const clickedAt = new Date();
    const awaitFor = 1500;
    setIsSubmitting(true);

    return system.create(payload).finally(async () => {
      const response = await refresh();
      const delta = new Date().getTime() - clickedAt.getTime();

      if (response?.data) setSystemList(response.data);
      if (awaitFor <= delta) setIsSubmitting(false);
      else {
        setTimeout(() => setIsSubmitting(false), awaitFor - delta);
      }
    });
  };

  const removeSystem = async (id: number, system: string) => {
    return remove(id).then(() => {
      setDeletedItem(system);
      return refresh().finally(() => {
        setIsSubmitting(false);
      });
    });
  };

  const updateSystem = async (id: number, payload: SystemPayload, system: string) => {
    return update(id, payload).then(() => {
      setUpdatedItem(system);
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
    if (data) setSystemList(data);
  }, [data, setSystemList]);

  return {
    addSystem,
    removeSystem,
    updateSystem,
    reset,
    isSubmitting,
    systemList,
    system,
    loading,
    error,
    deletingError,
    deletedItem,
    updatingError,
    updatedItem,
    updating,
  };
};

export default useSystems;
