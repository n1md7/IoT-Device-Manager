import { useState } from 'react';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="h-full" id="mobile-menu">
        <div className="flex flex-row justify-between">
          <button className="nav-icon bg-[url(nav.svg)]" onClick={() => setIsMenuOpen(true)}></button>
          <button className="nav-icon bg-[url(home.svg)]"></button>
          <button className="nav-icon bg-[url(switch.svg)]"></button>
        </div>
      </div>
      {/*adding new system*/}
      <div className={`${isMenuOpen ? "block" : "hidden"}`}>
        <div className="menu-wrapper">
          <div className="close">
            <button className="nav-icon bg-[url(close.svg)]" onClick={() => setIsMenuOpen(false)}></button>
          </div>
          <div className="nav-items">
            <button className="nav-item" onClick={() => console.log("manage systems clicked")}>Manage systems</button>
            <button className="nav-item" onClick={() => console.log("component systems clicked")}>Manage components</button>
            <button className="nav-item" onClick={() => console.log("report a bug clicked")}>Report a bug</button>
          </div>
        </div>
      </div>
    </>
  )
}
export default NavBar;