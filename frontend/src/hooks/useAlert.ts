import { useAtom } from 'jotai';

import {
  alertBtnText,
  alertMessage,
  alertOnBtnClick,
  alertShow,
  alertTitle,
  AlertType,
  alertType,
} from '../atoms/alertAtoms.ts';
import { ModalType, modalType } from '../atoms/modalAtoms.ts';

type ShowAlertProps = {
  type: AlertType;
  title: string;
  message: string;
  btnText?: string;
  modalType: ModalType;
};

export const useAlert = () => {
  const [type, setType] = useAtom(alertType);
  const [title, setTitle] = useAtom(alertTitle);
  const [message, setMessage] = useAtom(alertMessage);
  const [show, setShow] = useAtom(alertShow);
  const [btnText, setBtnText] = useAtom(alertBtnText);
  const [onClick, setOnClick] = useAtom(alertOnBtnClick);
  const [modalName, setModalName] = useAtom(modalType);

  const showAlert = ({ type, title, message, btnText, modalType }: ShowAlertProps) => {
    setShow(true);
    setType(type);
    setTitle(title);
    setMessage(message);
    setModalName(modalType);
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
    onClick,
    showAlert,
    hideAlert,
    modalName,
  };
};
