const ManageComponent = () => {
  return (
    <div className="control-view-container">
      <div className="card-item">
        <div className="card-header">
          <div className="system-details">
            <div className="system-name text-light-purple">Water Level Component</div>
            <span className="uppercase text-white">Edit</span>
          </div>
        </div>
        <div className="card-body">
          <span className="">Device code: </span> <span>LOOO1</span>
          <span className="">Device type: </span> <span>Switch</span>
          <span className="">System: </span> <span>Water System</span>
          <span className="">Shareable: </span> <span>Yes</span>
        </div>
      </div>
    </div>
  )
}

export default ManageComponent;