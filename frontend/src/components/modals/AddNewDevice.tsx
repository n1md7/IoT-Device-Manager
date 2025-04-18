import * as React from 'react';
import useDevice from '../../hooks/useDevice.ts';
import { useEffect, useState } from 'react';
import { Show } from '../utils/Show.tsx';
import { useSetAtom } from 'jotai/index';
import { useAlert } from '../../hooks/useAlert.ts';
import { errorDetailsAtom, errorMessageAtom } from '../../atoms/statusAtoms.ts';

interface Props {
  setIsNewDeviceOpen: (value: boolean) => void;
}

const AddNewDevice = ({ setIsNewDeviceOpen }: Props) => {
  const setErrorDetails = useSetAtom(errorDetailsAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const { addDevice, isSubmitting, device } = useDevice();
  const { showAlert, hideAlert } = useAlert();
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

    await addDevice({
      code: formData.code,
      type: formData.type,
      name: formData.name,
      description: formData.description,
      version: formData.version,
      ipAddress: formData.ipAddress,
    });
  };

  useEffect(() => {
    if (device.error) {
      setErrorDetails(device.error.details ?? 'Unknown error details.');
      setErrorMessage(device.error.message ?? 'Unknown error message.');
    }
  }, [device.error, setErrorDetails, setErrorMessage]);

  useEffect(() => {
    if (device.statusCode && !isSubmitting) {
      showAlert({
        type: 'success',
        title: 'Successfully Added',
        message: 'New device has been added!',
      });
      setIsNewDeviceOpen(false);
    }
  }, [device.statusCode, setIsNewDeviceOpen, showAlert, hideAlert, isSubmitting]);

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
            <button type="submit" className="button bg-purple text-white">
              <Show when={!isSubmitting} fallback="Saving...">
                Save
              </Show>
            </button>
            <button type="button" className="button bg-light-gray text-purple" onClick={() => setIsNewDeviceOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewDevice;
