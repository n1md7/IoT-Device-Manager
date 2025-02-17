
interface Props {
  setIsNewSystemOpen: (value: boolean) => void;
}

const AddNewSystem = ({setIsNewSystemOpen} : Props) => {

  return (
    <div className="modal-wrapper">
      <div className='modal-container'>
        <h2>Create System</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-5">
            <label htmlFor="systemName" className="block">System name:</label>
            <div className="mt-2">
              <div className="input-group">
                <input type="text" name="systemName" id="systemName" className="input-field"
                       placeholder="e.g. water system" />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="systemDesc" className="block">Description: </label>
            <div className="mt-2">
              <div
                className="input-group">
                  <textarea name="systemDesc" id="systemDesc" className="input-field"
                            placeholder="e.g. water system for outdoor pump" />
              </div>
            </div>
          </div>
          <div className="button-container">
            <button className="button bg-purple text-white">Save</button>
            <button className="button bg-light-gray text-purple" onClick={() => setIsNewSystemOpen(false)}>Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddNewSystem;