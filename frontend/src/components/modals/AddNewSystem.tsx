import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAlert } from '../../hooks/useAlert.ts';
import { Show } from '../utils/Show.tsx';
import useSystem from '../../hooks/useSystem.ts';

interface Props {
  setIsNewSystemOpen: (value: boolean) => void;
}

const AddNewSystem = ({ setIsNewSystemOpen }: Props) => {
  const { addSystem, isSubmitting, system } = useSystem();
  const { showAlert, hideAlert } = useAlert();
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
      showAlert({
        type: 'error',
        title: 'Failed',
        message: 'There seems to be a problem while adding the new item.',
        errorMessage: system.error.message,
        errorDetails: system.error.details,
      });
      setIsNewSystemOpen(false);
    }
  }, [setIsNewSystemOpen, showAlert, system.error]);

  useEffect(() => {
    if (system.data && !isSubmitting) {
      showAlert({
        type: 'success',
        title: 'Successfully Added',
        message: 'New system has been added!',
      });
      setIsNewSystemOpen(false);
    }
  }, [system.data, isSubmitting, setIsNewSystemOpen, showAlert, hideAlert]);

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
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
            <button type="submit" className="button bg-purple text-white">
              <Show when={!isSubmitting} fallback="Saving...">
                Save
              </Show>
            </button>
            <button type="button" className="button bg-light-gray text-purple" onClick={() => setIsNewSystemOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewSystem;
