import InfoIcon from '../icons/InfoIcon.tsx';

const Welcome = () => {
  return (
<<<<<<< HEAD
    <div className='welcome-container'>
      <div className="icon bg-[url(info.svg)]"><InfoIcon className={"text-light-dark"} /></div>
=======
    <div className="welcome-container">
      <div className="icon bg-[url(info.svg)]">
        <InfoIcon className={'text-light-dark'} />
      </div>
>>>>>>> c4f28dd6f33548bdbffe53b13b2bed1919603385
      <div className="header">Hi, Welcome!</div>
      <div className="text">
        Please make sure you have at least one system configured. <br />
        Start adding by clicking "Add System" button below.
      </div>
    </div>
  );
};

export default Welcome;
