const SystemControlView = () => {
  return (
    <div className="control-view-container">
      <div className="card-item">
        <div className="card-header">
          <div className="system-details">
            <div className="system-name text-md">Water System</div>
            <span className="uppercase">Off</span>
          </div>
          <div className="system-desc">A supply system for water tanks.</div>
        </div>
        <div className="card-body">
          <div className="mb-8">
            <label htmlFor="inputTimer" className="">Set timer: </label>
            <input
              list="datalist"
              id="inputTimer"
              type="range"
              min="1"
              max="20"
              className="w-full"
            />
            <datalist id="datalist">
              <option value="1"></option>
              <option value="5"></option>
              <option value="10"></option>
              <option value="15"></option>
              <option value="20"></option>
            </datalist>
          </div>
          <div className="text-center">Duration: 15 minutes</div>
        </div>
        <div className="card-tool gap-3">
          <button className="control-button">Turn ON</button>
          <button className="edit-button"></button>
        </div>
      </div>
      <div className="card-item">
        <div className="card-header">
          <div className="system-details">
            <div className="system-name text-md">Water System</div>
            <span className="uppercase">Off</span>
          </div>
          <div className="system-desc">A supply system for water tanks.</div>
        </div>
        <div className="card-body">
          <div className="mb-8">
            <label htmlFor="inputTimer" className="">Set timer: </label>
            <input
              list="datalist"
              id="inputTimer"
              type="range"
              min="1"
              max="20"
              className="w-full"
            />
            <datalist id="datalist">
              <option value="1"></option>
              <option value="5"></option>
              <option value="10"></option>
              <option value="15"></option>
              <option value="20"></option>
            </datalist>
          </div>
          <div className="text-center">Duration: 15 minutes</div>
        </div>
        <div className="card-tool gap-3">
          <button className="control-button">Turn ON</button>
          <button className="edit-button"></button>
        </div>
      </div>
    </div>
  )
}

export default SystemControlView;