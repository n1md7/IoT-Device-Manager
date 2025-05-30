import * as React from 'react';
import { useEffect, useState } from 'react';
import { Show } from '@src/components/utils/Show';
import useDisplayAlert from '@src/hooks/useDisplayAlert';
import useSystem from '@src/hooks/useSystem.ts';

interface Props {
  setIsNewSystemOpen: (value: boolean) => void;
  selectedId?: number;
  actionTitle?: string;
}

const AddNewSystem = ({ setIsNewSystemOpen, selectedId, actionTitle }: Props) => {
  const { addSystem, isSubmitting, system, systemList, updateSystem, updatingError, updatedItem } = useSystem();
  const { displaySuccess, displayError } = useDisplayAlert();
  const [newSystemName, setNewSystemName] = useState<string | null>(null);
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
    setNewSystemName(formData.name);

    const payload = {
      name: formData.name,
      description: formData.description,
    };

    if (selectedId) {
      await updateSystem(selectedId, payload, formData.name);
    } else {
      await addSystem(payload);
    }
  };

  useEffect(() => {
    if (systemList.systems.length > 0) {
      const updateItem = systemList.systems.find((item) => item.id === selectedId);

      if (updateItem) {
        setFormData({
          name: updateItem.name,
          description: updateItem.description,
        });
      }
    }
  }, [selectedId, systemList.systems]);

  useEffect(() => {
    if (system.error) {
      displayError({
        actionText: 'adding',
        errorMessage: system.error.message,
        errorDetails: system.error.details,
      });
      setIsNewSystemOpen(false);
    }
  }, [displayError, setIsNewSystemOpen, system.error]);

  useEffect(() => {
    if (system.data && !isSubmitting) {
      displaySuccess({
        actionText: 'added',
        item: `${newSystemName}`,
      });
      setIsNewSystemOpen(false);
    }
  }, [system.data, isSubmitting, setIsNewSystemOpen, displaySuccess, newSystemName]);

  useEffect(() => {
    if (updatingError) {
      displayError({
        actionText: 'updating',
        errorMessage: updatingError.message,
        errorDetails: updatingError.details,
      });
      setIsNewSystemOpen(false);
    }
  }, [displayError, setIsNewSystemOpen, updatingError]);

  useEffect(() => {
    if (updatedItem && !updatingError) {
      displaySuccess({
        actionText: 'updated',
        item: updatedItem,
      });
      setIsNewSystemOpen(false);
    }
  }, [displaySuccess, setIsNewSystemOpen, updatedItem, updatingError]);

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        <h2>{actionTitle} System</h2>
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
            <button type="submit" className="button hover:bg-purple/80 bg-purple text-white" disabled={isSubmitting}>
              <Show when={!isSubmitting} fallback="Saving...">
                Save
              </Show>
            </button>
            <button
              type="button"
              className="button cancel hover:text-light-gray/80 text-card-label"
              onClick={() => setIsNewSystemOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewSystem;
