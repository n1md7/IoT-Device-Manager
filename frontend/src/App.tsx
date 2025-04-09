import * as React from 'react';
import { ReactElement, useEffect, useState } from 'react';
import NavBar from './components/NavBar.tsx';
import PageHeader from './components/PageHeader.tsx';
import AddNewSchedule from './components/AddNewSchedule.tsx';
import AddNewSystem from './components/AddNewSystem.tsx';
import AddNewComponent from './components/AddNewComponent.tsx';
import AddNewDevice from './components/AddNewDevice.tsx';
import ManageSchedule from './components/ManageSchedule.tsx';
import ManageSystem from './components/ManageSystem.tsx';
import ManageComponent from './components/ManageComponent.tsx';
import useSystem from './hooks/useSystem.ts';
import useSchedule from './hooks/useSchedule.ts';
import useComponent from './hooks/useComponent.ts';
import useDevice from './hooks/useDevice.ts';

function App() {
  const { systemList } = useSystem();
  const { scheduleList } = useSchedule();
  const { componentList } = useComponent();
  const { deviceList } = useDevice();
  const [isNewSystemOpen, setIsNewSystemOpen] = useState(false);
  const [isNewComponentOpen, setIsNewComponentOpen] = useState(false);
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [isNewDeviceOpen, setIsNewDeviceOpen] = useState(false);
  const [activeView, setActiveView] = useState<ReactElement>(<ManageSchedule />);
  const [showModal, setShowModal] = useState<ReactElement | null>(null);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  const pageTitleMap = new Map<React.FC, string>([
    [ManageSchedule, 'Dashboard'],
    [ManageSystem, 'System'],
    [ManageComponent, 'Component'],
  ]);

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

  const handleNewSystemView = () => {
    setIsNewSystemOpen(true);
    setShowModal(<AddNewSystem setIsNewSystemOpen={setIsNewSystemOpen} refetch={refetch} />);
  };

  const handleNewComponentView = () => {
    setIsNewComponentOpen(true);
    setShowModal(<AddNewComponent setIsNewComponentOpen={setIsNewComponentOpen} refetch={refetch} />);
  };

  const handleNewScheduleView = () => {
    setIsNewScheduleOpen(true);
    setShowModal(<AddNewSchedule setIsNewScheduleOpen={setIsNewScheduleOpen} refetch={refetch} />);
  };

  const handleNewDeviceView = () => {
    setIsNewDeviceOpen(true);
    setShowModal(<AddNewDevice setIsNewDeviceOpen={setIsNewDeviceOpen} refetch={refetch} />);
  };

  const handleMenuClick = (component: ReactElement) => {
    setActiveView(component);

    const updatePageHeader = pageTitleMap.get(component.type as React.FC);
    setPageTitle(updatePageHeader ?? 'Dashboard');
  };

  return (
    <>
      <div className="container-main page-main">
        <div className="container-nav">
          <NavBar onMenuClick={handleMenuClick} />
        </div>
        <div className="container-header">
          <PageHeader pageTitle={pageTitle} />
        </div>
        <div className="container-body h-dvh">
          <div className="page-body">{activeView}</div>
        </div>
        <div className="container-toolbar h-15">
          <div className="page-bottom">
            <button className="button bg-purple text-white" onClick={handleNewSystemView}>
              Add System
            </button>
            <button className="button bg-light-gray text-purple" onClick={handleNewComponentView}>
              Add Component
            </button>
            <button className="button bg-purple text-white" onClick={handleNewDeviceView}>
              Add Device
            </button>
            <button className="button bg-light-gray text-purple" onClick={handleNewScheduleView}>
              Add Schedule
            </button>
          </div>
        </div>
      </div>

      {isNewSystemOpen && <div className="block">{showModal}</div>}

      {isNewComponentOpen && <div className="block">{showModal}</div>}

      {isNewScheduleOpen && <div className="block">{showModal}</div>}

      {isNewDeviceOpen && <div className="block">{showModal}</div>}
    </>
  );
}

export default App;
