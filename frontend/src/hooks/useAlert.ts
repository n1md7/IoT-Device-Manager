import { useAtom } from 'jotai';

import {
  alertBtnText,
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
  const [btnText, setBtnText] = useAtom(alertBtnText);
  const [onClick, setOnClick] = useAtom(alertOnBtnClick);

  const showAlert = ({ type, title, message, btnText, errorDetails, errorMessage }: ShowAlertProps) => {
    setShow(true);
    setType(type);
    setTitle(title);
    setMessage(message);
    if (errorMessage) setErrorMessage(errorMessage);
    if (errorDetails) setErrorDetails(errorDetails);
    if (btnText) setBtnText(btnText);
  };

  const resetAlert = () => {
    setBtnText('Okay');
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
    btnText,
    errorDetails,
    errorMessage,
    onClick,
    showAlert,
    hideAlert,
  };
};
