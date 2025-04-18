import { ReactElement, useEffect, useState } from 'react';
import AddNewSystem from './modals/AddNewSystem.tsx';
import AddNewComponent from './modals/AddNewComponent.tsx';
import AddNewSchedule from './modals/AddNewSchedule.tsx';
import AddNewDevice from './modals/AddNewDevice.tsx';
import AddIcon from '../icons/AddIcon.tsx';

const Settings = () => {
  const [showModal, setShowModal] = useState<ReactElement | null>(null);
  const [isNewSystemOpen, setIsNewSystemOpen] = useState(false);
  const [isNewComponentOpen, setIsNewComponentOpen] = useState(false);
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [isNewDeviceOpen, setIsNewDeviceOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isNewSystemOpen) setIsNewSystemOpen(false);
      if (event.key === 'Escape' && isNewComponentOpen) setIsNewComponentOpen(false);
      if (event.key === 'Escape' && isNewScheduleOpen) setIsNewScheduleOpen(false);
      if (event.key === 'Escape' && isNewDeviceOpen) setIsNewDeviceOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNewSystemOpen, isNewComponentOpen, isNewScheduleOpen, isNewDeviceOpen]);

  const handleModal = (modal: 'system' | 'component' | 'schedule' | 'device') => () => {
    setIsMenuOpen(false);
    if (modal === 'system') {
      setIsNewSystemOpen(true);
      setShowModal(<AddNewSystem setIsNewSystemOpen={setIsNewSystemOpen} />);
    }
    if (modal === 'component') {
      setIsNewComponentOpen(true);
      setShowModal(<AddNewComponent setIsNewComponentOpen={setIsNewComponentOpen} />);
    }
    if (modal === 'schedule') {
      setIsNewScheduleOpen(true);
      setShowModal(<AddNewSchedule setIsNewScheduleOpen={setIsNewScheduleOpen} />);
    }
    if (modal === 'device') {
      setIsNewDeviceOpen(true);
      setShowModal(<AddNewDevice setIsNewDeviceOpen={setIsNewDeviceOpen} />);
    }
  };

  const handleItem = () => {
    setIsMenuOpen(true);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <>
      <button className="settings-icon" onClick={handleItem}>
        <AddIcon className={'text-card-label h-10'} />
      </button>

      <div className={`${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="setting-item fade-in">
          <button className="button" onClick={handleModal('system')}>
            Add System
          </button>
          <button className="button" onClick={handleModal('component')}>
            Add Component
          </button>
          <button className="button" onClick={handleModal('device')}>
            Add Device
          </button>
          <button className="button" onClick={handleModal('schedule')}>
            Add Schedule
          </button>
        </div>
      </div>

      {isNewSystemOpen && <div className="block">{showModal}</div>}

      {isNewComponentOpen && <div className="block">{showModal}</div>}

      {isNewScheduleOpen && <div className="block">{showModal}</div>}

      {isNewDeviceOpen && <div className="block">{showModal}</div>}
    </>
  );
};
export default Settings;
