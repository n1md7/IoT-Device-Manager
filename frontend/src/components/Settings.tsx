import { ReactElement, useEffect, useState } from 'react';
import AddIcon from '../icons/AddIcon.tsx';
import AddNewSystem from './modals/AddNewSystem.tsx';
import AddNewComponent from './modals/AddNewComponent.tsx';
import AddNewSchedule from './modals/AddNewSchedule.tsx';
import AddNewDevice from './modals/AddNewDevice.tsx';
import useSystem from '../hooks/useSystem.ts';
import useSchedule from '../hooks/useSchedule.ts';
import useComponent from '../hooks/useComponent.ts';
import useDevice from '../hooks/useDevice.ts';

const Settings = () => {
  const { systemList } = useSystem();
  const { scheduleList } = useSchedule();
  const { componentList } = useComponent();
  const { deviceList } = useDevice();
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

  const refetch = () => {
    if (isNewSystemOpen) systemList.refresh().catch((e) => console.error(e));
    if (isNewComponentOpen) componentList.refresh().catch((e) => console.error(e));
    if (isNewScheduleOpen) scheduleList.refresh().catch((e) => console.error(e));
    if (isNewDeviceOpen) deviceList.refresh().catch((e) => console.error(e));
  };

  const handleModal = (view: 'system' | 'component' | 'device' | 'schedule') => () => {
    setIsMenuOpen(false);
    if (view === 'system') {
      setIsNewSystemOpen(true);
      setShowModal(<AddNewSystem setIsNewSystemOpen={setIsNewSystemOpen} refetch={refetch} />);
    }
    if (view === 'component') {
      setIsNewComponentOpen(true);
      setShowModal(<AddNewComponent setIsNewComponentOpen={setIsNewComponentOpen} refetch={refetch} />);
    }
    if (view === 'schedule') {
      setIsNewScheduleOpen(true);
      setShowModal(<AddNewSchedule setIsNewScheduleOpen={setIsNewScheduleOpen} refetch={refetch} />);
    }
    if (view === 'device') {
      setIsNewDeviceOpen(true);
      setShowModal(<AddNewDevice setIsNewDeviceOpen={setIsNewDeviceOpen} refetch={refetch} />);
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
