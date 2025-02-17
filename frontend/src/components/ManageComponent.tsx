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
          <div className="item-data">Device code: LOOO1</div>
          <div className="item-data">Device type: Switch</div>
          <div className="item-data">System: Water System</div>
          <div className="item-data">Shareable: Yes</div>
        </div>
      </div>
    </div>
  )
}

export default ManageComponent;