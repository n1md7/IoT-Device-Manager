
const NavBar = () => {
  return (
    <div className="sm:hidden" id="mobile-menu">
      <div className="h-24 flex flex-row justify-between">
        <div className="nav-item bg-[url(../public/nav.svg)]"></div>
        <div className="nav-item bg-[url(../public/home.svg)]"></div>
        <div className="nav-item bg-[url(../public/switch.svg)]"></div>
      </div>
    </div>
  )
}
export default NavBar;