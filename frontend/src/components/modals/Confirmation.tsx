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
        </div>
        <div className="button-container">
          <button className="button hover:bg-red-600/80 bg-red-500 text-white mt-4" onClick={action}>
            Delete
          </button>
          <button className="button cancel hover:text-light-gray/80 text-card-label mt-2 pb-0" onClick={cancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
