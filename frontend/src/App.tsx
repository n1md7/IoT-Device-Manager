import NavBar from './components/NavBar.tsx';
import PageHeader from './components/PageHeader.tsx';
import Welcome from './components/Welcome.tsx';
import AddNewComponent from './components/AddNewComponent.tsx';
import { useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useState(false);

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
          <button className="button bg-purple text-white" onClick={() => setIsOpen(true)}>Add System</button>
          <AddNewComponent />
        </div>
      </div>
    </div>
      <div className={`${isOpen ? "block" : "hidden"}`}>
        <div className="modal-wrapper">
          <div className='modal-container'>
            <h2>Create New System</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-5">
                <label htmlFor="systemName" className="block">System name:</label>
                <div className="mt-2">
                  <div
                    className="input-group">
                    <input type="text" name="systemName" id="systemName" className="input-field" placeholder="e.g. water system" />
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="systemDesc" className="block">Description: </label>
                <div className="mt-2">
                  <div
                    className="input-group">
                    <textarea name="systemDesc" id="systemDesc" className="input-field" placeholder="e.g. water system for outdoor pump" />
                  </div>
                </div>
              </div>
              <div className="button-container">
                <button className="button bg-purple text-white">Save</button>
                <button className="button bg-light-gray text-purple" onClick={() => setIsOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
