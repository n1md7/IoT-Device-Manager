import * as React from 'react';
import { useEffect, useState } from 'react';
import { Show } from '@src/components/utils/Show';
import AddIcon from '@src/icons/AddIcon';
import useComponent from '@src/hooks/useComponent';
import useSystems from '@src/hooks/useSystem';
import useDevice from '@src/hooks/useDevice';
import useDisplayAlert from '@src/hooks/useDisplayAlert';

interface Props {
  setIsNewComponentOpen: (value: boolean) => void;
  selectedId?: number;
  actionTitle?: string;
}

const AddNewComponent = ({ setIsNewComponentOpen, selectedId, actionTitle }: Props) => {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  const { addComponent, isSubmitting, component, componentList, updateComponent, updatedItem, updatingError } = useComponent();
  const { displaySuccess, displayError } = useDisplayAlert();
  const { systemList } = useSystems();
  const { deviceList } = useDevice();

  const [formData, setFormData] = useState({
    deviceCode: '',
    systemId: 0,
    shared: false,
  });

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'selectedDevice') setSelectedDevice(String(value));
    if (name === 'selectedSystem') setSelectedSystem(Number(value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDevice || !selectedSystem) {
      console.error('Select item not found not found');
      return;
    }

    const payload = {
      deviceCode: selectedDevice,
      systemId: selectedSystem,
      shared: formData.shared,
    };

    if (selectedId) {
      await updateComponent(selectedId, payload, selectedDevice);
    } else {
      await addComponent(payload);
    }
  };

  useEffect(() => {
    if (componentList.components.length > 0) {
      const updatedItem = componentList.components.find((item) => item.id === selectedId);
      if (updatedItem) {
        setFormData({
          deviceCode: updatedItem.device.code,
          systemId: updatedItem.system.id,
          shared: updatedItem.shared,
        });

        setSelectedDevice(updatedItem.device.code);
        setSelectedSystem(updatedItem.system.id);
      }
    }
  }, [componentList.components, selectedId]);

  useEffect(() => {
    if (component.error) {
      displayError({
        actionText: 'adding',
        errorMessage: component.error.message,
        errorDetails: component.error.details,
      });
      setIsNewComponentOpen(false);
    }
  }, [component.error, displayError, setIsNewComponentOpen]);

  useEffect(() => {
    if (component.data && !isSubmitting) {
      displaySuccess({
        actionText: 'added',
        item: `New component`,
      });

      setIsNewComponentOpen(false);
    }
  }, [component.data, displaySuccess, isSubmitting, selectedDevice, setIsNewComponentOpen]);

  useEffect(() => {
    if (updatingError) {
      displayError({
        actionText: 'updating',
        errorMessage: updatingError.message,
        errorDetails: updatingError.details,
      });
      setIsNewComponentOpen(false);
    }
  }, [displayError, setIsNewComponentOpen, updatingError]);

  useEffect(() => {
    if (updatedItem && !updatingError) {
      displaySuccess({
        actionText: 'updated',
        item: 'item',
      });
      setIsNewComponentOpen(false);
    }
  }, [displaySuccess, setIsNewComponentOpen, updatedItem, updatingError]);

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        <h2>{actionTitle} Component</h2>
        <form onSubmit={handleSubmit}>
          <p className="mb-3 text-light-purple">All fields with * are required.</p>
          <div className="mb-5">
            <label htmlFor="selectedDevice" className="block">
              Select device *
            </label>
            <div className="mt-2 grid grid-cols-1">
              <div className="input-group">
                <select
                  id="selectedDevice"
                  name="selectedDevice"
                  value={selectedDevice ?? ''}
                  onChange={handleSelectChange}
                  className="select-field"
                  required
                >
                  <option value="" disabled>
                    please select...
                  </option>
                  <Show when={!!deviceList.devices.length} fallback="Loading...">
                    {deviceList.devices.map((device) => (
                      <option key={device.code} value={device.code}>
                        {device.name}
                      </option>
                    ))}
                  </Show>
                </select>
              </div>
            </div>
          </div>
          <div className="select-with-btn-group">
            <div className="mb-5 w-full">
              <label htmlFor="selectedSystem" className="block">
                Select system *
              </label>
              <div className="mt-2">
                <div className="input-group">
                  <select
                    id="selectedSystem"
                    name="selectedSystem"
                    value={selectedSystem ?? ''}
                    onChange={handleSelectChange}
                    className="select-field"
                    required
                  >
                    <option value="" disabled>
                      please select...
                    </option>
                    <Show when={!!systemList.systems.length} fallback="Loading...">
                      {systemList.systems.map((system) => (
                        <option key={system.id} value={system.id}>
                          {system.name}
                        </option>
                      ))}
                    </Show>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end w-1/6">
              <div className="button-add-system">
                {' '}
                <AddIcon className="text-light-gray" />{' '}
              </div>
            </div>
          </div>
          <div className="mb-5 flex items-center">
            <label className={`toggle ${formData.shared ? 'bg-purple' : 'bg-gray-700'}`}>
              <input
                type="checkbox"
                name="shared"
                id="shared"
                onChange={() => {
                  setFormData({ ...formData, shared: !formData.shared });
                }}
                checked={formData.shared}
                className="hidden"
              />
              <div className={`toggle-icon ${formData.shared ? 'translate-x-6' : ''}`}></div>
              <span className="sr-only">Toggle switch</span>
            </label>
            <label htmlFor="shared" className="block ml-3">
              Make component shareable
            </label>
          </div>
          <div></div>
          <div className="button-container">
            <button className="button hover:bg-purple/80 bg-purple text-white" disabled={isSubmitting}>
              <Show when={!isSubmitting} fallback="Saving...">
                Save
              </Show>
            </button>
            <button
              className="button cancel hover:text-light-gray/80 text-card-label"
              onClick={() => setIsNewComponentOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewComponent;
