import EditIcon from '../icons/EditIcon.tsx';
import { ReactElement, useState } from 'react';
import AddNewSystem from './modals/AddNewSystem.tsx';
import useSystem from '../hooks/useSystem.ts';
import { Show } from './utils/Show.tsx';
import NewItem from './utils/NewItem.tsx';

const ManageSystem = () => {
  const { systemList } = useSystem();
  const [isNewSystemOpen, setIsNewSystemOpen] = useState(false);
  const [showModal, setShowModal] = useState<ReactElement | null>(null);

  const handleNewSystemView = () => {
    setIsNewSystemOpen(true);
    setShowModal(<AddNewSystem setIsNewSystemOpen={setIsNewSystemOpen} />);
  };

  return (
    <>
      <div className="control-view-container">
        <Show when={systemList.systems.length > 0}>
          {systemList.systems.map((system, index) => (
            <div key={system.id} className="card-item fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
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
          ))}
        </Show>

        <NewItem item={'System'} btnAction={handleNewSystemView} />
      </div>
      <Show when={systemList.systems.length <= 0}>
        <div className="pt-5 error-msg">No available data.</div>
      </Show>
      {isNewSystemOpen && <div className="block">{showModal}</div>}
    </>
  );
};

export default ManageSystem;
