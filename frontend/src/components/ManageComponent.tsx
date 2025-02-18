import EditIcon from '../icons/EditIcon.tsx';

const ManageComponent = () => {
  return (
    <div className="control-view-container">
      <div className="card-item">
        <div className="card-header">
          <form className="system-details">
            <label htmlFor="edit-component-id" className="system-name text-green">Water Level Component</label>
            <button id="edit-component-id" className="edit-button"><EditIcon className={'text-light-gray'} /></button>
          </form>
        </div>
        <div className="card-body">
          <div className="item-data">
            <div className="">Device code:</div>
            <div className="text-purple font-bold">LOOO1</div>
          </div>
          <div className="item-data">
            <div className="">Device type:</div>
            <div className="text-light-gray">Switch</div>
          </div>
          <div className="item-data">
            <div className="">System:</div>
            <div className="text-light-gray">Water System</div>
          </div>
          <div className="item-data">
            <div className="">Shareable:</div>
            <div className="text-light-gray">Yes</div>
          </div>
        </div>
      </div>
      <div className="card-item">
        <div className="card-header">
          <form className="system-details">
            <label htmlFor="edit-component-id" className="system-name text-green">Water Level Component</label>
            <button id="edit-component-id" className="edit-button"><EditIcon className={'text-light-gray'} /></button>
          </form>
        </div>
        <div className="card-body">
          <div className="item-data">
            <div className="">Device code:</div>
            <div className="text-purple font-bold">LOOO1</div>
          </div>
          <div className="item-data">
            <div className="">Device type:</div>
            <div className="text-light-gray">Switch</div>
          </div>
          <div className="item-data">
            <div className="">System:</div>
            <div className="text-light-gray">Water System</div>
          </div>
          <div className="item-data">
            <div className="">Shareable:</div>
            <div className="text-light-gray">Yes</div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ManageComponent;