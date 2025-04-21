import { useAtom } from 'jotai';

import {
  alertErrorDetails,
  alertErrorMessage,
  alertMessage,
  alertOnBtnClick,
  alertShow,
  alertTitle,
  AlertType,
  alertType,
} from '../atoms/alertAtoms.ts';

type ShowAlertProps = {
  type: AlertType;
  title: string;
  message: string;
  btnText?: string;
  errorMessage?: string;
  errorDetails?: string;
};

export const useAlert = () => {
  const [type, setType] = useAtom(alertType);
  const [title, setTitle] = useAtom(alertTitle);
  const [message, setMessage] = useAtom(alertMessage);
  const [errorMessage, setErrorMessage] = useAtom(alertErrorMessage);
  const [errorDetails, setErrorDetails] = useAtom(alertErrorDetails);
  const [show, setShow] = useAtom(alertShow);
  const [onClick, setOnClick] = useAtom(alertOnBtnClick);

  const showAlert = ({ type, title, message, errorDetails, errorMessage }: ShowAlertProps) => {
    setShow(true);
    setType(type);
    setTitle(title);
    setMessage(message);
    if (errorMessage) setErrorMessage(errorMessage);
    if (errorDetails) setErrorDetails(errorDetails);
  };

  const resetAlert = () => {
    setOnClick(() => void 0);
  };

  const hideAlert = () => {
    resetAlert();
    setShow(false);
  };

  return {
    type,
    title,
    message,
    show,
    errorDetails,
    errorMessage,
    onClick,
    showAlert,
    hideAlert,
  };
};
