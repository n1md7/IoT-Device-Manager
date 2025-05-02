import { useEffect, useState } from 'react';
import ManageComponent from '@src/components/ManageComponent';
import ManageSchedule from '@src/components/ManageSchedule';
import CloseIcon from '@src/icons/CloseIcon';
import HomeIcon from '@src/icons/HomeIcon';
import MenuIcon from '@src/icons/MenuIcon';
import ManageSystem from '@src/components/ManageSystem';
import ManageDevice from '@src/components/ManageDevice';

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
              Schedules
            </button>
            <button className="nav-item" onClick={() => onMenuClick(<ManageSystem />)}>
              Systems
            </button>
            <button className="nav-item" onClick={() => onMenuClick(<ManageComponent />)}>
              Components
            </button>
            <button className="nav-item" onClick={() => onMenuClick(<ManageDevice />)}>
              Devices
            </button>
            <button className="nav-item">Report a bug</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default NavBar;
