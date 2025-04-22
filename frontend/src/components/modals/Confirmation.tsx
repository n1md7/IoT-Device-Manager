type Props = {
  action: () => void;
  cancel: () => void;
  itemToDelete: string;
};

const Confirmation = ({ action, cancel, itemToDelete }: Props) => {
  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        <div className="status-div fade-in">
          <div>
            <h2 className="text-red-500">Are you sure?</h2>
            <span>
              {' '}
              You are about to delete <em className="text-red-500 font-bold">{itemToDelete}</em> item!
            </span>
          </div>
          <div className="button-container">
            <button className="button bg-red-500 text-white mt-4 w-14" onClick={action}>
              Delete
            </button>
            <button className="button bg-white text-light-dark mt-4 w-14" onClick={cancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
