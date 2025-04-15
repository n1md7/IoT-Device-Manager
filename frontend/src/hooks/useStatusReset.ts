import { useSetAtom } from 'jotai';
import { errorDetailsAtom, errorMessageAtom, isFailedAtom, isSuccessAtom } from '../atoms/statusAtoms.ts';

export const useStatusReset = () => {
  const setIsFailed = useSetAtom(isFailedAtom);
  const setIsSuccess = useSetAtom(isSuccessAtom);
  const setErrorDetails = useSetAtom(errorDetailsAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);

  return () => {
    setIsFailed(false);
    setIsSuccess(false);
    setErrorDetails(null);
    setErrorMessage(null);
  };
};

export default useStatusReset;
