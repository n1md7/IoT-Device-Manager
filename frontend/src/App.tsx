import * as React from 'react';
import NavBar from './components/NavBar.tsx';
import PageHeader from './components/PageHeader.tsx';
import AddNewSystem from './components/AddNewSystem.tsx';
import AddNewComponent from './components/AddNewComponent.tsx';
import Dashboard from './components/Dashboard.tsx';
import { ReactElement, useEffect, useState } from 'react';
import ManageSystem from './components/ManageSystem.tsx';
import ManageComponent from './components/ManageComponent.tsx';
import AddNewSchedule from './components/AddNewSchedule.tsx';

function App() {
  const [isNewSystemOpen, setIsNewSystemOpen] = useState(false);
  const [isNewComponentOpen, setIsNewComponentOpen] = useState(false);
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [activeView, setActiveView] = useState<ReactElement>(<Dashboard />);
  const [showModal, setShowModal] = useState<ReactElement | null>(null);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  const pageTitleMap = new Map<React.FC, string>([
    [Dashboard, 'Dashboard'],
    [ManageSystem, 'System'],
    [ManageComponent, 'Component'],
  ]);

  const refetch = () => {
    setActiveView(<Dashboard />);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isNewSystemOpen) setIsNewSystemOpen(false);
      if (event.key === 'Escape' && isNewComponentOpen) setIsNewComponentOpen(false);
      if (event.key === 'Escape' && isNewScheduleOpen) setIsNewScheduleOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNewSystemOpen, isNewComponentOpen, isNewScheduleOpen]);

  const handleNewSystemView = () => {
    setIsNewSystemOpen(true);
    setShowModal(<AddNewSystem setIsNewSystemOpen={setIsNewSystemOpen} />);
  };

  const handleNewComponentView = () => {
    setIsNewComponentOpen(true);
    setShowModal(<AddNewComponent setIsNewComponentOpen={setIsNewComponentOpen} />);
  };

  const handleNewScheduleView = () => {
    setIsNewScheduleOpen(true);
    setShowModal(<AddNewSchedule setIsNewScheduleOpen={setIsNewScheduleOpen} refetch={refetch} />);
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
            <button className="button bg-purple text-white" onClick={handleNewScheduleView}>
              Add Schedule
            </button>
          </div>
        </div>
      </div>

      {isNewSystemOpen && <div className="block">{showModal}</div>}

      {isNewComponentOpen && <div className="block">{showModal}</div>}

      {isNewScheduleOpen && <div className="block">{showModal}</div>}
    </>
  );
}

export default App;
