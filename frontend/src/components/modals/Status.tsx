import { useAtom } from 'jotai';
import { errorDetailsAtom, errorMessageAtom, isFailedAtom, isSuccessAtom } from '../../atoms/statusAtoms.ts';

interface Props {
  onClose: () => void;
  onDone: () => void;
  newItem?: string | null;
}

const Status = ({ onClose, onDone, newItem }: Props) => {
  const [isSuccess] = useAtom(isSuccessAtom);
  const [isFailed] = useAtom(isFailedAtom);
  const [errorMessage] = useAtom(errorMessageAtom);
  const [errorDetails] = useAtom(errorDetailsAtom);

  if (isSuccess) {
    return (
      <div className="status-div fade-in" style={{ animationDelay: `0.05` }}>
        <div>
          <h2 className="">Successfully Added</h2>
          <p>
            New component <strong className="text-purple"> {newItem} </strong> has been added!
          </p>
        </div>
        <div className="button-container">
          <button className="button bg-purple text-white mt-4" onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="status-div fade-in" style={{ animationDelay: `0.05` }}>
        <div>
          <h2 className="text-red-600">Failed</h2>
          <p>There seems to be a problem while adding a new component.</p>

          <div className="error-details">
            <span className="text-red-600">{errorMessage}: </span>
            <span className="text-gray-500">{errorDetails}</span>
          </div>
        </div>
        <div className="button-container">
          <button className="button bg-light-gray text-purple mt-4" onClick={onClose}>
            Okay
          </button>
        </div>
      </div>
    );
  }
  return null;
};

export default Status;
