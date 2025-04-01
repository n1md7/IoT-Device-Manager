import * as React from 'react';
import { useState } from 'react';
import useSystem from '../hooks/useSystem.ts';

interface Props {
  setIsNewSystemOpen: (value: boolean) => void;
}

const AddNewSystem = ({ setIsNewSystemOpen }: Props) => {
  const { addSystem, isSubmitting } = useSystem();
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-wrapper">
        <div className="modal-container">
          <h2>Create System</h2>
          <div className="mb-5">
            <label htmlFor="systemName" className="block">
              System name:
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
              Description:{' '}
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
        </div>
      </div>
    </form>
  );
};

export default AddNewSystem;
