import * as React from 'react';
import { useEffect, useState } from 'react';
import { Show } from '@src/components/utils/Show';
import useDevice from '@src/hooks/useDevice';
import useDisplayAlert from '@src/hooks/useDisplayAlert';

interface Props {
  setIsNewDeviceOpen: (value: boolean) => void;
}

const AddNewDevice = ({ setIsNewDeviceOpen }: Props) => {
  const { addDevice, isSubmitting, device } = useDevice();
  const { displaySuccess, displayError } = useDisplayAlert();
  const [newDeviceName, setNewDeviceName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: '',
    name: '',
    description: '',
    version: '',
    ipAddress: '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewDeviceName(formData.name);

    await addDevice({
      name: formData.name,
      description: formData.description,
      code: formData.code,
      type: formData.type,
      version: formData.version,
      ipAddress: formData.ipAddress,
    });
  };

  useEffect(() => {
    if (device.error) {
      displayError({
        actionText: 'adding',
        errorMessage: device.error.message,
        errorDetails: device.error.details,
      });
      setIsNewDeviceOpen(false);
    }
  }, [device.error, displayError, setIsNewDeviceOpen]);

  useEffect(() => {
    if (device.statusCode && !isSubmitting) {
      displaySuccess({
        actionText: 'added',
        item: `${newDeviceName}`,
      });
      setIsNewDeviceOpen(false);
    }
  }, [device.statusCode, setIsNewDeviceOpen, isSubmitting, displaySuccess, newDeviceName]);

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        <h2>Create Device</h2>
        <form onSubmit={handleSubmit}>
          <p className="mb-3 text-light-purple">All fields with * are required.</p>
          <div className="mb-5">
            <label htmlFor="DeviceName" className="block">
              Device name *
            </label>
            <div className="mt-2">
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  id="DeviceName"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="input-field"
                  placeholder="e.g. feeder"
                  required
                />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="DeviceDesc" className="block">
              Description
            </label>
            <div className="mt-2">
              <div className="input-group">
                <textarea
                  name="description"
                  id="DeviceDesc"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="input-field"
                  placeholder="e.g. device for outdoor pump"
                />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="DeviceCode" className="block">
              Device code *
            </label>
            <div className="mt-2">
              <div className="input-group">
                <input
                  type="text"
                  name="code"
                  id="DeviceCode"
                  value={formData.code}
                  onChange={handleFormChange}
                  className="input-field"
                  placeholder="e.g. D0001"
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full justify-between">
            <div className="mb-5 w-1/2">
              <label htmlFor="DeviceType" className="block">
                Type *
              </label>
              <div className="mt-2">
                <div className="input-group">
                  <input
                    type="text"
                    name="type"
                    id="DeviceType"
                    value={formData.type}
                    onChange={handleFormChange}
                    className="input-field"
                    placeholder="e.g. switch"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mb-5 w-1/3">
              <label htmlFor="DeviceVersion" className="block">
                Version *
              </label>
              <div className="mt-2">
                <div className="input-group">
                  <input
                    type="text"
                    name="version"
                    id="DeviceVersion"
                    value={formData.version}
                    onChange={handleFormChange}
                    className="input-field"
                    placeholder="e.g. 1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="DeviceIpVersion" className="block">
              IP address
            </label>
            <div className="mt-2">
              <div className="input-group">
                <input
                  type="text"
                  name="ipAddress"
                  id="DeviceIpVersion"
                  value={formData.ipAddress}
                  onChange={handleFormChange}
                  className="input-field"
                  placeholder="e.g. 192.168.1.7"
                />
              </div>
            </div>
          </div>
          <div className="button-container">
            <button type="submit" className="button hover:bg-purple/80 bg-purple text-white" disabled={isSubmitting}>
              <Show when={!isSubmitting} fallback="Saving...">
                Save
              </Show>
            </button>
            <button
              type="button"
              className="button cancel hover:text-light-gray/80 text-card-label"
              onClick={() => setIsNewDeviceOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewDevice;
