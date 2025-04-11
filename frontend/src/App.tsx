import * as React from 'react';
import { ReactElement, useState } from 'react';
import NavBar from './components/NavBar.tsx';
import PageHeader from './components/PageHeader.tsx';
import ManageSchedule from './components/ManageSchedule.tsx';
import ManageSystem from './components/ManageSystem.tsx';
import ManageComponent from './components/ManageComponent.tsx';
import Settings from './components/Settings.tsx';
import ManageDevice from './components/ManageDevice.tsx';

function App() {
  const [activeView, setActiveView] = useState<ReactElement>(<ManageSchedule />);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  const pageTitleMap = new Map<React.FC, string>([
    [ManageSchedule, 'Schedule'],
    [ManageSystem, 'System'],
    [ManageComponent, 'Component'],
    [ManageDevice, 'Device'],
  ]);

  const handleMenuClick = (component: ReactElement) => {
    setActiveView(component);

    const updatePageHeader = pageTitleMap.get(component.type as React.FC);
    setPageTitle(updatePageHeader ?? 'Dashboard');
  };

  return (
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
      <div className="container-toolbar">
        <div className="flex items-center justify-center pt-7">
          <div className="text-card-label">
            <span>Created with love by </span>
            <a className="font-bold" href="https://github.com/n1md7">
              Harry
            </a>
            <span> and </span>
            <a className="font-bold" href="https://github.com/kaeri-gg">
              Katie
            </a>
            . ❤️🕹️🎮 🥰{' '}
          </div>
        </div>
      </div>
      <Settings />
    </div>
  );
}

export default App;
