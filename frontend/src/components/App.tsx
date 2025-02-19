import NavBar from './NavBar.tsx';
import PageHeader from './PageHeader.tsx';
import Welcome from './Welcome.tsx';
import AddNewSystem from './AddNewSystem.tsx';
import AddNewComponent from './AddNewComponent.tsx';
import { ReactElement, useEffect, useState } from 'react';
import { api } from '../services/api-client.tsx';

function App() {
  const [isNewSystemOpen, setIsNewSystemOpen] = useState(false);
  const [isNewComponentOpen, setIsNewComponentOpen] = useState(false);
  const [activeView, setActiveView] = useState<ReactElement>(<Welcome />);
  const [showModal, setShowModal] = useState<ReactElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isNewSystemOpen) setIsNewSystemOpen(false);
      if (event.key === 'Escape' && isNewComponentOpen) setIsNewComponentOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleNewSystemView = () => {
    setIsNewSystemOpen(true);
    setShowModal(<AddNewSystem setIsNewSystemOpen={setIsNewSystemOpen} />);
  };

  const handleNewComponentView = () => {
    setIsNewComponentOpen(true);
    setShowModal(<AddNewComponent setIsNewComponentOpen={setIsNewComponentOpen} />);
  };

  const handleMenuClick = (component: ReactElement) => {
    setActiveView(component);
  };

  useEffect(() => {
    api.devices
      .get()
      .then((response) => console.log(response.data.devices))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const { response, controller } = api.devices.getWithAbort();
    response
      .then((response) => {
        console.log(response.data.devices);
      })
      .catch((error) => console.error(error));

    return () => {
      controller.abort('stop!');
    };
  }, []);

  return (
    <>
      <div className="container-main page-main">
        <div className="container-nav">
          <NavBar onMenuClick={handleMenuClick} />
        </div>
        <div className="container-header">
          <PageHeader />
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
          </div>
        </div>
      </div>

      {isNewSystemOpen && <div className="block">{showModal}</div>}

      {isNewComponentOpen && <div className="block">{showModal}</div>}
    </>
  );
}

export default App;
