import { ReactElement, useEffect, useState } from 'react';
import { Show } from '@src/components/utils/Show';
import { Nullable } from '@src/types/utilsType';
import EditIcon from '@src/icons/EditIcon';
import DeleteIcon from '@src/icons/DeleteIcon';
import AddNewComponent from './modals/AddNewComponent';
import NewItem from './utils/NewItem';
import Confirmation from './modals/Confirmation';
import useComponent from '@src/hooks/useComponent';
import useDisplayAlert from '@src/hooks/useDisplayAlert';

const ManageComponent = () => {
  const [isNewComponentOpen, setIsNewComponentOpen] = useState(false);
  const [showModal, setShowModal] = useState<ReactElement | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<Nullable<number>>(null);
  const [selectedComponentName, setSelectedComponentName] = useState<Nullable<string>>(null);
  const { componentList, removeComponent, deletingError, deletedItem, reset, isSubmitting } = useComponent();
  const { displaySuccess, displayError } = useDisplayAlert();

  const handleNewComponentView = () => {
    setIsNewComponentOpen(true);
    setShowModal(<AddNewComponent setIsNewComponentOpen={setIsNewComponentOpen} />);
  };

  const handleDeleteItem = (id: Nullable<number>, component: Nullable<string>) => {
    if (id && component) {
      removeComponent(id, component).then(() => {
        setShowConfirmation(false);
      });
    }
  };

  useEffect(() => {
    if (deletedItem && !isSubmitting) {
      reset();
      displaySuccess({
        actionText: 'deleted',
        item: `${deletedItem} component`,
      });
    }
  }, [deletedItem, isSubmitting, reset, displaySuccess]);

  useEffect(() => {
    if (deletingError) {
      reset();
      displayError({
        actionText: 'deleting',
        errorMessage: deletingError.message,
        errorDetails: deletingError.details,
      });
    }
  }, [deletingError, reset, displayError]);

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
                  <EditIcon className={'text-icon'} />
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
          action={() => handleDeleteItem(selectedComponentId, selectedComponentName)}
          cancel={() => setShowConfirmation(false)}
          itemToDelete={selectedComponentName ?? 'NO ITEM SELECTED'}
        />
      </Show>

      <Show when={componentList.components.length <= 0}>
        <div className="pt-5 error-msg">No available data.</div>
      </Show>
    </>
  );
};

export default ManageComponent;
