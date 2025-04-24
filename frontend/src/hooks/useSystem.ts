import { SystemPayload, SystemData, SystemsResponseData } from '../types/systemTypes.ts';
import useCreate from './useCreate.ts';
import { useEffect, useState } from 'react';
import useData from './useData.ts';
import { useAtom } from 'jotai';
import { systemListAtom } from '../atoms/listAtom.ts';
import useDelete from './useDelete.ts';

const useSystems = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [systemList, setSystemList] = useAtom(systemListAtom);
  const { data, error, loading, refresh } = useData<SystemsResponseData>('/api/v1/systems');
  const system = useCreate<SystemPayload, SystemData>('/api/v1/systems/create');
  const item = useDelete<SystemsResponseData>('/api/v1/systems');

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

  const removeSystem = async (id: string | number) => {
    return item.remove(id).finally(async () => {
      const response = await refresh();

      if (response?.data) setSystemList(response.data);
      setIsSubmitting(false);
    });
  };

  useEffect(() => {
    if (data) setSystemList(data);
  }, [data, setSystemList]);

  return {
    addSystem,
    removeSystem,
    isSubmitting,
    systemList,
    system,
    loading,
    error,
  };
};

export default useSystems;
