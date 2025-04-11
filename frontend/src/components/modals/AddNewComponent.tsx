import * as React from 'react';
import { useEffect, useState } from 'react';
import AddIcon from '../../icons/AddIcon.tsx';
import useComponent from '../../hooks/useComponent.ts';
import useSystems from '../../hooks/useSystem.ts';
import useDevice from '../../hooks/useDevice.ts';
import { useAtom } from 'jotai';
import { errorDetailsAtom, errorMessageAtom, isFailedAtom, isSuccessAtom } from '../../atoms/statusAtoms.ts';
import Status from './Status.tsx';
import useResetStatus from '../../hooks/useResetStatus.ts';

interface Props {
  setIsNewComponentOpen: (value: boolean) => void;
  refetch: () => void;
}
const AddNewComponent = ({ setIsNewComponentOpen, refetch }: Props) => {
  const { addComponent, isSubmitting, component } = useComponent();
  const { systemList } = useSystems();
  const { deviceList } = useDevice();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  const [isFailed, setIsFailed] = useAtom(isFailedAtom);
  const [isSuccess, setIsSuccess] = useAtom(isSuccessAtom);
  const [, setErrorDetails] = useAtom(errorDetailsAtom);
  const [, setErrorMessage] = useAtom(errorMessageAtom);
  const resetStatus = useResetStatus();

  const [formData, setFormData] = useState({
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

    await addComponent({
      deviceCode: selectedDevice,
      systemId: selectedSystem,
      shared: formData.shared,
    });
  };

  useEffect(() => {
    if (component.error) {
      setIsFailed(true);
      setErrorDetails(component.error.details ?? 'Unknown error details.');
      setErrorMessage(component.error.message ?? 'Unknown error message.');
    }
  }, [component.error, setErrorDetails, setErrorMessage, setIsFailed]);

  useEffect(() => {
    if (component.data) {
      setIsSuccess(true);
    }
  }, [component.data, setIsSuccess]);

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        <Status
          onClose={() => setIsNewComponentOpen(false)}
          onDone={() => {
            refetch();
            resetStatus();
            setIsNewComponentOpen(false);
          }}
          newItem={component?.data?.device.name}
        />
        {!isSuccess && !isFailed && (
          <>
            <h2>Create Component</h2>
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
                      {deviceList?.data?.devices.length ? (
                        deviceList.data.devices.map((device) => (
                          <option key={device.code} value={device.code}>
                            {device.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No devices found</option>
                      )}
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
                        {systemList?.data?.systems?.length ? (
                          systemList.data.systems.map((system) => (
                            <option key={system.id} value={system.id}>
                              {system.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No systems found</option>
                        )}
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
                <button className="button bg-purple text-white" disabled={isSubmitting}>
                  Save
                </button>
                <button className="button bg-light-gray text-purple" onClick={() => setIsNewComponentOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddNewComponent;
