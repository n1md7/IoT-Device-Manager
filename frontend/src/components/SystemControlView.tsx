const SystemControlView = () => {
  return (
    <div className="control-view-container">
      <div className="card-item">
        <div className="card-header">
          <div className="system-details">
            <div className="system-name text-green">Water System</div>
            <span className="uppercase text-green">ON</span>
          </div>
          <div className="system-desc">A supply system for water tanks.</div>
        </div>
        <div className="card-body">
          <div className="text-center">
            <div className="mb-5">
              <label htmlFor="remainingTime" className="block">Remaining time:</label>
              <div className="mt-2">
                <div className="input-group">
                  <input type="text" value="14:53" name="remainingTime" id="remainingTime" className="input-field timer-count"
                         placeholder="00:00" disabled/>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">Duration: 15 minutes</div>
        </div>
        <div className="card-tool">
          <button className="control-button bg-green">Turn OFF</button>
          <button className="edit-button"></button>
        </div>
      </div>
      <div className="card-item">
        <div className="card-header">
          <div className="system-details">
            <div className="system-name text-orange">Water System</div>
            <span className="uppercase">OFF</span>
          </div>
          <div className="system-desc">A supply system for water tanks.</div>
        </div>
        <div className="card-body">
          <div className="mb-8">
            <label htmlFor="inputTimer" className="">Set timer: </label>
            <input id="inputTimer" type="range" className="input-range" />
          </div>
          <div className="text-center">Total duration: 15 minutes</div>
        </div>
        <div className="card-tool">
          <button className="control-button bg-orange">Turn ON</button>
          <button className="edit-button"></button>
        </div>
      </div>
    </div>
  )
}

export default SystemControlView;