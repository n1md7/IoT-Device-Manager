interface Props {
  className?: string;
}

const AddIcon = ({ className = "w-6 h-6 text-gray-800" }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 800"
      className={`fill-current ${className}`}
    >
      <path d="M296.3,400H503.7M400,503.7V296.3" stroke="currentColor" strokeWidth="50" strokeLinecap="round" />
    </svg>
  );
};

export default AddIcon;
