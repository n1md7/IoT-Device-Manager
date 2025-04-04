interface Props {
  className?: string;
}

const EditIcon = ({ className }: Props) => {
  return (
    <svg
      width="40px"
      height="40px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 800"
      className={`stroke-current ${className}`}
    >
      <path
        className="stroke-inherit stroke-[57px] fill-none"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M555.77,306.38,371.2,491a53.48,53.48,0,0,1-27.28,14.6l-78.53,15.7 15.71-78.52a53.44,53.44,0,0,1,14.6-27.28L480.27,230.88m75.5,75.5 37.75-37.75a26.7,26.7,0,0,0,0-37.75l-37.75-37.75a26.7,26.7,0,0,0-37.75,0l-37.75,37.75m75.5,75.5-75.5-75.5"
      />
      <path
        className="stroke-inherit stroke-[57px] fill-none"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M198.66,614.68h373.7"
      />
    </svg>
  );
};

export default EditIcon;
