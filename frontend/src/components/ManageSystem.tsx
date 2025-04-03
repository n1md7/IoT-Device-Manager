import EditIcon from '../icons/EditIcon.tsx';
import useData from '../hooks/useData.ts';
import { SystemsResponseData } from '../types/systemTypes.ts';
import AddIcon from '../icons/AddIcon.tsx';
import { ReactElement, useState } from 'react';
import AddNewSystem from './AddNewSystem.tsx';

const ManageSystem = () => {
  const systemList = useData<SystemsResponseData>('/api/v1/systems');
  const [isNewSystemOpen, setIsNewSystemOpen] = useState(false);
  const [showModal, setShowModal] = useState<ReactElement | null>(null);

  const handleNewSystemView = () => {
    setIsNewSystemOpen(true);
    setShowModal(<AddNewSystem setIsNewSystemOpen={setIsNewSystemOpen} />);
  };

  return (
    <>
      <div className="control-view-container">
        {systemList?.data?.systems.length ? (
          systemList?.data?.systems.map((system) => (
            <div key={system.id} className="card-item">
              <div className="card-header">
                <form className="system-details">
                  <label htmlFor="edit-component-id" className="system-name text-orange">
                    {system.name}
                  </label>
                  <button id="edit-component-id" className="edit-button">
                    <EditIcon className={'text-light-gray'} />
                  </button>
                </form>
              </div>
              <div className="card-body">
                <div className="">
                  <div className="text-card-label">System Description:</div>
                  <div className="my-1">{system.description}</div>
                </div>
                <div className="mt-3">
                  <div className="text-card-label">
                    System ID: <span className="text-white">{system.id}</span>
                  </div>
                </div>
                <div className="flex mt-7">
                  <div className="text-green font-bold">Components:</div>
                  <div className="text-green font-bold ml-2">{system.components.length}</div>
                </div>
                <div className="mt-3">
                  <div className="">
                    {system.components.map((component) => (
                      <div key={component.id} className="my-1">
                        ✅ {component.device.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="error-msg"> {systemList.error}</p>
        )}
        <button className="card-item cursor-pointer" onClick={handleNewSystemView}>
          <div className="card-body new-schedule">
            <div className="icon button-add-schedule">
              {' '}
              <AddIcon className="text-light-dark" />{' '}
            </div>
            <div className="text">Add New System</div>
          </div>
        </button>
      </div>
      {isNewSystemOpen && <div className="block">{showModal}</div>}
    </>
  );
};

export default ManageSystem;
