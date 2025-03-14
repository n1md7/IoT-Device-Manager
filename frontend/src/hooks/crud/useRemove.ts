import { useState } from 'react';

const useRemove = (endpoint: string) => {
  const [removing, setRemoving] = useState<boolean>(false);
  // TODO: Implement this hook
  return {
    removing,
    removeById: async (id: number) => {},
  };
};

export default useRemove;
