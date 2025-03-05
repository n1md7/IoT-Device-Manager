import useData from './useData.ts';
import { ComponentsResponseData } from '../types/componentTypes.ts';
//const fileType = import.meta.env.VITE_TYPE || '';

const useComponent = () => {
  const { data, error, loading } = useData<ComponentsResponseData>('/api/v1/components');
  return { componentList: data?.components || [], error, loading };
};

export default useComponent;
