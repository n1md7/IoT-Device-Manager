interface Props {
  className?: string;
}

const CloseIcon = ({ className = "w-6 h-6 text-white" }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 800"
      className={`fill-current ${className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="57"
        d="M170.78,170.78a46.3,46.3,0,0,1,65.48,0h0L400,334.52,563.72,170.78a46.31,46.31,0,0,1,65.48,65.48L465.48,400,629.22,563.72a46.32,46.32,0,0,1-65.5,65.5L400,465.48,236.26,629.22a46.31,46.31,0,0,1-65.48-65.5L334.52,400,170.78,236.26a46.3,46.3,0,0,1,0-65.48Z"
      />
    </svg>
  );
};

export default CloseIcon;
