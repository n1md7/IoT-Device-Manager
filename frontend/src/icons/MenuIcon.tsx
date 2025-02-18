interface Props {
  className?: string;
}

const MenuIcon = ({ className }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 800"
      className={`stroke-current ${className}`}
      fill="none"
      strokeWidth="66.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g id="Menu_Hamburger_MD" data-name="Menu / Hamburger_MD">
        <path d="M166.67,567.67H633.33M166.67,401H633.33M166.67,234.33H633.33" />
      </g>
    </svg>
  );
};

export default MenuIcon;
