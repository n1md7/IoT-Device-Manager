import useData from './useData.ts';
import { SystemsResponseData } from '../types/systemTypes.ts';

const useSystems = () => {
  const { data, error, loading } = useData<SystemsResponseData>('/api/v1/systems');
  return { systemList: data, error, loading };
};

export default useSystems;
