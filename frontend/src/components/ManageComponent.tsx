import EditIcon from '../icons/EditIcon.tsx';
import DeleteIcon from '../icons/DeleteIcon.tsx';
import { ReactElement, useState } from 'react';
import AddNewComponent from './modals/AddNewComponent.tsx';
import useComponent from '../hooks/useComponent.ts';
import { Show } from './utils/Show.tsx';
import NewItem from './utils/NewItem.tsx';
import { useAlert } from '../hooks/useAlert.ts';
import Confirmation from './modals/Confirmation.tsx';

const ManageComponent = () => {
  const [isNewComponentOpen, setIsNewComponentOpen] = useState(false);
  const [showModal, setShowModal] = useState<ReactElement | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<number | null>(null);
  const [selectedComponentName, setSelectedComponentName] = useState<string | null>(null);
  const { componentList, removeComponent } = useComponent();
  const { showAlert } = useAlert();

  const handleNewComponentView = () => {
    setIsNewComponentOpen(true);
    setShowModal(<AddNewComponent setIsNewComponentOpen={setIsNewComponentOpen} />);
  };

  const handleDeleteItem = (id: number, component: string) => {
    if (id) {
      showAlert({
        type: 'success',
        title: 'Successful',
        message: `"${component}" has been deleted.`,
      });
      removeComponent(id).catch((err) => {
        console.log(err);
      });
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <div className="control-view-container">
        <Show when={componentList.components.length > 0}>
          {componentList.components.map((component, index) => (
            <div key={component.id} className="card-item fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="card-header">
                <form className="system-details">
                  <label
                    htmlFor="edit-component-id"
                    className={component.inUse ? 'system-name text-green ' : 'system-name text-card-label'}
                  >
                    {component.device.name}
                  </label>
                  <span className="text-card-label font-normal">Status: {component.inUse ? '🟢' : '🔴'}</span>
                </form>
              </div>
              <div className="card-body">
                <div className="item-data">
                  <div className="">Device code:</div>
                  <div className="text-light-gray font-bold">{component.device.code}</div>
                </div>
                <div className="item-data">
                  <div className="">Device type:</div>
                  <div className="text-light-gray">{component.device.type}</div>
                </div>
                <div className="item-data">
                  <div className="">System:</div>
                  <div className="text-light-gray">{component.system.name}</div>
                </div>
                <div className="item-data">
                  <div className="">Shareable:</div>
                  <div className="text-light-gray">{component.shared ? '✅ Yes' : '⛔ No'}</div>
                </div>
              </div>
              <div className="card-tool">
                <button
                  className="delete-button"
                  onClick={() => {
                    setSelectedComponentId(component.id);
                    setSelectedComponentName(component.device.name);
                    setShowConfirmation(true);
                  }}
                >
                  <DeleteIcon className={'#4f4f4f'} />
                </button>
                <button className="edit-button">
                  <EditIcon className={'text-light-dark'} />
                </button>
              </div>
            </div>
          ))}
        </Show>

        <NewItem item={'Component'} btnAction={handleNewComponentView}></NewItem>
        {isNewComponentOpen && <div className="block">{showModal}</div>}
      </div>

      <Show when={showConfirmation}>
        <Confirmation
          action={() => handleDeleteItem(selectedComponentId!, selectedComponentName!)}
          cancel={() => setShowConfirmation(false)}
          itemToDelete={selectedComponentName!}
        />
      </Show>

      <Show when={componentList.components.length <= 0}>
        <div className="pt-5 error-msg">No available data.</div>
      </Show>
    </>
  );
};

export default ManageComponent;
