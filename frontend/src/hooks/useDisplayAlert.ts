import { useAlert } from './useAlert.ts';

type Item = {
  item: string;
  actionText: string;
};

type ErrorDetails = {
  errorMessage: string;
  errorDetails?: string;
  actionText: string;
};

const useDisplayAlert = () => {
  const { showAlert } = useAlert();

  const displaySuccess = ({ item, actionText }: Item) => {
    showAlert({
      type: 'success',
      title: `Successfully ${actionText}`,
      message: `"${item}" has been ${actionText}.`,
    });
  };

  const displayError = ({ errorMessage, errorDetails, actionText }: ErrorDetails) => {
    showAlert({
      type: 'error',
      title: 'Failed',
      message: `There seems to be a problem while ${actionText} the item.`,
      errorMessage: errorMessage,
      errorDetails: errorDetails,
    });
  };

  return { displaySuccess, displayError };
};

export default useDisplayAlert;
