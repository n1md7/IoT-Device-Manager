import { useEffect, useState } from 'react';
import ManageComponent from './ManageComponent.tsx';
import ManageSchedule from './ManageSchedule.tsx';
import CloseIcon from '../icons/CloseIcon.tsx';
import HomeIcon from '../icons/HomeIcon.tsx';
import MenuIcon from '../icons/MenuIcon.tsx';
import ManageSystem from './ManageSystem.tsx';

interface Props {
  onMenuClick: (component: JSX.Element) => void;
}
const NavBar = ({ onMenuClick }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <>
      <div className="h-full" id="mobile-menu">
        <div className="flex flex-row justify-between">
          <button className="nav-icon" onClick={() => setIsMenuOpen(true)}>
            <MenuIcon className={'text-purple'} />
          </button>
          <button className="nav-icon">
            <HomeIcon className={'text-light-gray'} />
          </button>
          <button className="nav-icon bg-[url(switch.svg)]"></button>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="menu-wrapper">
          <div className="close">
            <button className="nav-icon" onClick={() => setIsMenuOpen(false)}>
              <CloseIcon className={'text-light-gray'} />{' '}
            </button>
          </div>
          <div className="nav-items">
            <button className="nav-item" onClick={() => onMenuClick(<ManageSchedule />)}>
              Manage Schedules
            </button>
            <button className="nav-item" onClick={() => onMenuClick(<ManageSystem />)}>
              Manage systems
            </button>
            <button className="nav-item" onClick={() => onMenuClick(<ManageComponent />)}>
              Manage components
            </button>
            <button className="nav-item">Report a bug</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default NavBar;
