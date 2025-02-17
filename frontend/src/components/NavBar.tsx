import { useEffect, useState } from 'react';
import ManageComponent from './ManageComponent.tsx';
import Dashboard from './Dashboard.tsx';

interface Props {
  onMenuClick: (component: JSX.Element) => void;
}
const NavBar = ({ onMenuClick } : Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  })

  return (
    <>
      <div className="h-full" id="mobile-menu">
        <div className="flex flex-row justify-between">
          <button className="nav-icon bg-[url(nav.svg)]" onClick={() => setIsMenuOpen(true)}></button>
          <button className="nav-icon bg-[url(home.svg)]"></button>
          <button className="nav-icon bg-[url(switch.svg)]"></button>
        </div>
      </div>

      <div className={`${isMenuOpen ? "block" : "hidden"}`}>
        <div className="menu-wrapper">
          <div className="close">
            <button className="nav-icon bg-[url(close.svg)]" onClick={() => setIsMenuOpen(false)}></button>
          </div>
          <div className="nav-items">
            <button className="nav-item" onClick={() => onMenuClick(<Dashboard />)}>Dashboard</button>
            <button className="nav-item">Manage systems</button>
            <button className="nav-item" onClick={() => onMenuClick(<ManageComponent />)}>Manage components</button>
            <button className="nav-item">Report a bug</button>
          </div>
        </div>
      </div>
    </>
  )
}
export default NavBar;