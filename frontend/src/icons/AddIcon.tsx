interface Props {
  className?: string;
}

const AddIcon = ({ className }: Props) => {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 2a1 1 0 00-1 1v4H3a1 1 0 100 2h4v4a1 1 0 102 0V9h4a1 1 0 100-2H9V3a1 1 0 00-1-1z"
        fill={`fill-current ${className}`}
      />
    </svg>
  );
};

export default AddIcon;
