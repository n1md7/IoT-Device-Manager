import { useAlert } from './useAlert.ts';

type DeletedItem = {
  item: string;
};

type ErrorDetails = {
  errorMessage: string;
  errorDetails?: string;
};

const useDeleteAlert = () => {
  const { showAlert } = useAlert();

  const displaySuccess = ({ item }: DeletedItem) => {
    showAlert({
      type: 'success',
      title: 'Successful',
      message: `"${item}" has been deleted.`,
    });
  };

  const displayError = ({ errorMessage, errorDetails }: ErrorDetails) => {
    showAlert({
      type: 'error',
      title: 'Failed',
      message: 'There seems to be a problem while deleting the item.',
      errorMessage: errorMessage,
      errorDetails: errorDetails,
    });
  };

  return { displaySuccess, displayError };
};

export default useDeleteAlert;
