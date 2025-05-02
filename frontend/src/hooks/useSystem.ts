import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import useCreate from '@src/hooks/useCreate';
import useDelete from '@src/hooks/useDelete';
import useData from '@src/hooks/useData';
import { SystemPayload, SystemData, SystemsResponseData } from '@src/types/systemTypes';
import { systemListAtom } from '@src/atoms/listAtom';

const useSystems = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [systemList, setSystemList] = useAtom(systemListAtom);
  const [deletedItem, setDeletedItem] = useState<string | null>();
  const { data, error, loading, refresh } = useData<SystemsResponseData>('/api/v1/systems');
  const { remove, error: deletingError, reset: deleteReset } = useDelete<SystemsResponseData>('/api/v1/systems');
  const system = useCreate<SystemPayload, SystemData>('/api/v1/systems/create');

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
    reset,
    isSubmitting,
    systemList,
    system,
    loading,
    error,
    deletingError,
    deletedItem,
  };
};

export default useSystems;
