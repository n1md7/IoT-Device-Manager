import * as React from 'react';
import { useEffect, useState } from 'react';
import useSystem from '../../hooks/useSystem.ts';

interface Props {
  setIsNewSystemOpen: (value: boolean) => void;
  refetch: () => void;
}

const AddNewSystem = ({ setIsNewSystemOpen, refetch }: Props) => {
  const { addSystem, isSubmitting, system } = useSystem();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await addSystem({
      name: formData.name,
      description: formData.description,
    });
  };

  useEffect(() => {
    if (system.error) {
      setIsFailed(true);
      setErrorDetail(system.error.details ?? 'Unknown error details.');
      setErrorMessage(system.error.message ?? 'Unknown error message.');
    }
  }, [system.error]);

  useEffect(() => {
    if (system.data) {
      setIsSuccess(true);
    }
  }, [system.data]);

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        {isSuccess && (
          <div className="status-div fade-in" style={{ animationDelay: `0.05` }}>
            <div>
              <h2 className="">Successfully Added</h2>
              <p>
                New system <strong className="text-purple">{formData.name}</strong> has been added!
              </p>
            </div>
            <div className="button-container">
              <button
                className="button bg-purple text-white mt-4"
                onClick={() => {
                  refetch();
                  setIsNewSystemOpen(false);
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
              <p>There seems to be a problem while adding a new system.</p>

              <div className="error-details">
                <span className="text-red-600">{errorMessage}: </span>
                <span className="text-gray-500">{errorDetail}</span>
              </div>
            </div>
            <div className="button-container">
              <button
                className="button bg-light-gray text-purple mt-4"
                onClick={() => {
                  setIsNewSystemOpen(false);
                }}
              >
                Okay
              </button>
            </div>
          </div>
        )}{' '}
        {!isSuccess && !isFailed && (
          <>
            <h2>Create System</h2>
            <form onSubmit={handleSubmit}>
              <p className="mb-3 text-light-purple">All fields with * are required.</p>

              <div className="mb-5">
                <label htmlFor="systemName" className="block">
                  System name *
                </label>
                <div className="mt-2">
                  <div className="input-group">
                    <input
                      type="text"
                      name="name"
                      id="systemName"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="input-field"
                      placeholder="e.g. water system"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="systemDesc" className="block">
                  Description *
                </label>
                <div className="mt-2">
                  <div className="input-group">
                    <textarea
                      name="description"
                      id="systemDesc"
                      value={formData.description}
                      onChange={handleFormChange}
                      className="input-field"
                      placeholder="e.g. water system for outdoor pump"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="button-container">
                <button type="submit" className="button bg-purple text-white" disabled={isSubmitting}>
                  Save
                </button>
                <button type="button" className="button bg-light-gray text-purple" onClick={() => setIsNewSystemOpen(false)}>
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

export default AddNewSystem;
