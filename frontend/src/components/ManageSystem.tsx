import EditIcon from '../icons/EditIcon.tsx';

const ManageSystem = () => {
  return (
    <div className="control-view-container">
      <div className="card-item">
        <div className="card-header">
          <form className="system-details">
            <label htmlFor="edit-component-id" className="system-name text-orange">Water System</label>
            <button id="edit-component-id" className="edit-button"><EditIcon className={'text-light-gray'} /></button>
          </form>
        </div>
        <div className="card-body">
          <div className="">
            <div className="font-bold">System Description:</div>
            <div className="my-1">A supply system for garden
              sprinkle.</div>
          </div>
          <div className="flex mt-7">
            <div className="text-green font-bold">Components:</div>
            <div className="text-green font-bold ml-2"> 2</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageSystem;