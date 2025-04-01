interface Props {
  className?: string;
}

const EditIcon = ({ className }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="35px"
      height="35px"
      viewBox="0,0,256,256"
      fill={`stroke-current ${className}`}
    >
      <g
        //fill="{`${className}`}"
        fill-rule="nonzero"
        stroke="none"
        stroke-width="1"
        stroke-linecap="butt"
        stroke-linejoin="miter"
        stroke-miterlimit="10"
        stroke-dasharray=""
        stroke-dashoffset="0"
        font-family="none"
        font-weight="none"
        font-size="none"
        text-anchor="none"
      >
        <g transform="scale(10.66667,10.66667)">
          <path d="M12,2c-5.53,0 -10,4.47 -10,10c0,5.53 4.47,10 10,10c5.53,0 10,-4.47 10,-10c0,-5.53 -4.47,-10 -10,-10zM16.707,15.293c0.391,0.391 0.391,1.023 0,1.414c-0.195,0.195 -0.451,0.293 -0.707,0.293c-0.256,0 -0.512,-0.098 -0.707,-0.293l-3.293,-3.293l-3.293,3.293c-0.195,0.195 -0.451,0.293 -0.707,0.293c-0.256,0 -0.512,-0.098 -0.707,-0.293c-0.391,-0.391 -0.391,-1.023 0,-1.414l3.293,-3.293l-3.293,-3.293c-0.391,-0.391 -0.391,-1.023 0,-1.414c0.391,-0.391 1.023,-0.391 1.414,0l3.293,3.293l3.293,-3.293c0.391,-0.391 1.023,-0.391 1.414,0c0.391,0.391 0.391,1.023 0,1.414l-3.293,3.293z"></path>
        </g>
      </g>
    </svg>
  );
};

export default EditIcon;
