import * as React from 'react';
import { useEffect, useState } from 'react';
import useDevice from '../hooks/useDevice.ts';

interface Props {
  setIsNewDeviceOpen: (value: boolean) => void;
  refetch: () => void;
}

const AddNewDevice = ({ setIsNewDeviceOpen, refetch }: Props) => {
  const { addDevice, isSubmitting, device } = useDevice();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
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
      setIsFailed(true);
      setErrorDetail(device.error.details ?? 'Unknown error details.');
      setErrorMessage(device.error.message ?? 'Unknown error message.');
    }
  }, [device.error]);

  useEffect(() => {
    if (device.statusCode) {
      setIsSuccess(true);
    }
  }, [device.statusCode]);

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        {isSuccess && (
          <div className="status-div fade-in" style={{ animationDelay: `0.05` }}>
            <div>
              <h2 className="">Successfully Added</h2>
              <p>
                New Device <strong className="text-purple">{formData.name}</strong> has been added!
              </p>
            </div>
            <div className="button-container">
              <button
                className="button bg-purple text-white mt-4"
                onClick={() => {
                  refetch();
                  setIsNewDeviceOpen(false);
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
        {isFailed && (
          <div className="status-div fade-in" style={{ animationDelay: `0.05` }}>
            <div>
              <h2 className="text-red-600">Failed</h2>
              <p>There seems to be a problem while adding a new Device.</p>

              <div className="error-details">
                <span className="text-red-600">{errorMessage}: </span>
                <span className="text-gray-500">{errorDetail}</span>
              </div>
            </div>
            <div className="button-container">
              <button
                className="button bg-light-gray text-purple mt-4"
                onClick={() => {
                  setIsNewDeviceOpen(false);
                }}
              >
                Okay
              </button>
            </div>
          </div>
        )}{' '}
        {!isSuccess && !isFailed && (
          <>
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
                <button type="submit" className="button bg-purple text-white" disabled={isSubmitting}>
                  Save
                </button>
                <button type="button" className="button bg-light-gray text-purple" onClick={() => setIsNewDeviceOpen(false)}>
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

export default AddNewDevice;
