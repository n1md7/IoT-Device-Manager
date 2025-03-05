import useData from './useData.ts';
import { SystemsResponseData } from '../types/systemTypes.ts';
//const fileType = import.meta.env.VITE_TYPE || '';

const useSystems = () => {
  const { data, error, loading } = useData<SystemsResponseData>('/api/v1/systems');
  return { systemList: data, error, loading };
};

export default useSystems;
