import { useState } from 'react';
import AddIcon from '../icons/AddIcon.tsx';

interface Props {
  setIsNewComponentOpen: (value: boolean) => void;
}
const AddNewComponent = ({setIsNewComponentOpen} : Props) => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className="modal-wrapper">
      <div className='modal-container'>
        <h2>Create Component</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-5">
            <label htmlFor="componentName" className="block">Component name:</label>
            <div className="mt-2">
              <div className="input-group">
                <input type="text" name="componentName" id="componentName" className="input-field"
                       placeholder="e.g. water level component" />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="deviceCode" className="block">Device code: </label>
            <div className="mt-2">
              <div className="input-group">
                <input type="text" name="deviceCode" id="deviceCode" className="input-field"
                       placeholder="autocomplete" disabled />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="selectedDevice" className="block">Select device:</label>
            <div className="mt-2 grid grid-cols-1">
              <div className="input-group">
                <select id="selectedDevice" name="selectedDevice" autoComplete="" className="select-field" required>
                  <option value="" disabled selected>please select...</option>
                  <option value="">Router</option>
                </select>
              </div>
            </div>
          </div>
          <div className="select-with-btn-group">
            <div className="mb-5 w-full">
              <label htmlFor="selectedSystem" className="block">Select system:</label>
              <div className="mt-2">
                <div className="input-group">
                  <select id="selectedSystem" name="selectedSystem" autoComplete="" className="select-field"
                          required>
                    <option value="" disabled selected>please select...</option>
                    <option value="">Water system</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end w-1/6">
              <div className="button-add-system"> <AddIcon className="text-light-gray" /> </div>
            </div>
          </div>
          <div className="mb-5 flex items-center">
            <label
              className={`toggle ${isToggled ? 'bg-purple' : 'bg-gray-700'}`}>
              <input type="checkbox" name="shareable" id="shareable"
                     checked={isToggled}
                     onChange={() => setIsToggled(!isToggled)}
                     className="hidden" />
              <div className={`toggle-icon ${isToggled ? 'translate-x-6' : ''}`}></div>
              <span className="sr-only">Toggle switch</span>
            </label>
            <label htmlFor="shareable" className="block ml-3">Make component shareable</label>
          </div>
          <div>

          </div>
          <div className="button-container">
            <button className="button bg-purple text-white">Save</button>
            <button className="button bg-light-gray text-purple" onClick={() => setIsNewComponentOpen(false)}>Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddNewComponent;