import NavBar from './components/NavBar.tsx';
import PageHeader from './components/PageHeader.tsx';
import Welcome from './components/Welcome.tsx';
import { useState } from 'react';

function App() {
  const [isNewSystemOpen, setIsNewSystemOpen] = useState(false);
  const [isNewComponentOpen, setIsNewComponentOpen] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  return (
    <>
      <div className="@container/main page-main h-dvh p-5 flex flex-col bg-dark">
        <div className="@container/nav">
          <NavBar />
        </div>
        <div className="@container/header">
          <PageHeader />
        </div>
        <div className="@container/body h-dvh">
          <div className='page-body'>
            <Welcome />
          </div>
        </div>
        <div className="@container/toolbar h-15">
          <div className="page-bottom">
            <button className="button bg-purple text-white" onClick={() => setIsNewSystemOpen(true)}>Add System</button>
            <button className="button bg-light-gray text-purple" onClick={() => setIsNewComponentOpen(true)}>Add
              Component
            </button>

          </div>
        </div>
      </div>
    {/*adding new system*/}
      <div className={`${isNewSystemOpen ? "block" : "hidden"}`}>
        <div className="modal-wrapper">
          <div className='modal-container'>
            <h2>Create System</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-5">
                <label htmlFor="systemName" className="block">System name:</label>
                <div className="mt-2">
                  <div
                    className="input-group">
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
      </div>

    {/*adding new component*/}
      <div className={`${isNewComponentOpen ? "block" : "hidden"}`}>
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
                  <div className="button-add-system">+
                  </div>
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
      </div>

    </>
  )
}

export default App;
