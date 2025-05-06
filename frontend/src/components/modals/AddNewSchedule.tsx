import * as React from 'react';
import { useEffect, useState } from 'react';
import { Show } from '@src/components/utils/Show';
import useSystems from '@src/hooks/useSystem';
import useSchedule from '@src/hooks/useSchedule';
import useDisplayAlert from '@src/hooks/useDisplayAlert';

interface Props {
  setIsNewScheduleOpen: (value: boolean) => void;
  selectedId?: number;
  actionTitle: string;
}
const AddNewSchedule = ({ setIsNewScheduleOpen, selectedId, actionTitle }: Props) => {
  const { addSchedule, isSubmitting, scheduler, updateSchedule, updatingError, updatedItem, updating } = useSchedule();
  const { displaySuccess, displayError } = useDisplayAlert();
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  const [newScheduleName, setNewScheduleName] = useState<string | null>(null);
  const { systemList } = useSystems();
  const { scheduleList } = useSchedule();

  const [formData, setFormData] = useState({
    name: '',
    startExpression: '',
    min: '',
    sec: '',
  });

  const handleSystemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSystem(Number(e.target.value));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewScheduleName(formData.name);

    if (!selectedSystem) {
      console.error('Selected system not found!');
      return;
    }

    const payload = {
      name: formData.name,
      startExpression: formData.startExpression,
      duration: {
        min: Number(formData.min),
        sec: Number(formData.sec),
      },
      systemId: selectedSystem,
    };

    if (selectedId) {
      console.log('update ', payload);
      await updateSchedule(selectedId, payload, formData.name);
    } else {
      console.log('add ', payload);
      await addSchedule(payload);
    }
  };

  useEffect(() => {
    if (updatingError) {
      displayError({
        actionText: 'updating',
        errorMessage: updatingError.message,
        errorDetails: updatingError.details,
      });
      setIsNewScheduleOpen(false);
    }
  }, [displayError, setIsNewScheduleOpen, updatingError]);

  useEffect(() => {
    if (scheduler.error) {
      displayError({
        actionText: 'adding',
        errorMessage: scheduler.error.message,
        errorDetails: scheduler.error.details,
      });
      setIsNewScheduleOpen(false);
    }
  }, [displayError, scheduler.error, setIsNewScheduleOpen]);

  useEffect(() => {
    if (scheduler.data && !isSubmitting) {
      displaySuccess({
        actionText: 'added',
        item: `${newScheduleName}`,
      });
      setIsNewScheduleOpen(false);
    }
  }, [isSubmitting, scheduler.data, setIsNewScheduleOpen, displaySuccess, newScheduleName]);

  useEffect(() => {
    if (updating && !updatingError) {
      displaySuccess({
        actionText: 'updated',
        item: 'item',
      });
      setIsNewScheduleOpen(false);
    }
  }, [displaySuccess, setIsNewScheduleOpen, updatedItem, updating, updatingError]);

  const updateItem = scheduleList?.schedules.find((item) => item.id === selectedId);
  useEffect(() => {
    if (updateItem) {
      setFormData({
        name: updateItem.name,
        startExpression: updateItem.startExpression,
        min: updateItem.duration.min.toLocaleString(),
        sec: updateItem.duration.sec.toLocaleString(),
      });
      setSelectedSystem(updateItem.system.id);
    }
  }, [updateItem]);

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        <h2>{actionTitle} Schedule</h2>
        <form onSubmit={handleSubmit}>
          <p className="mb-3 text-light-purple">All fields with * are required.</p>
          <div className="mb-5">
            <label htmlFor="name" className="block">
              Schedule name *
            </label>
            <div className="mt-2">
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  id="scheduleName"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="input-field"
                  placeholder="e.g. water pump afternoon sched"
                  required
                />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="startExpression" className="block">
              Cron Expression *
            </label>
            <div className="mt-2">
              <div className="input-group">
                <input
                  type="text"
                  name="startExpression"
                  id="scheduleExpression"
                  value={formData.startExpression}
                  onChange={handleFormChange}
                  className="input-field"
                  placeholder="e.g. 5 * * * * *"
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="mb-5 w-1/3">
              <label htmlFor="min" className="block">
                Minutes *
              </label>
              <div className="mt-2">
                <div className="input-group">
                  <input
                    type="text"
                    name="min"
                    id="scheduleMin"
                    value={formData.min}
                    onChange={handleFormChange}
                    className="input-field"
                    placeholder="e.g. 30"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mb-5 w-1/3">
              <label htmlFor="sec" className="block">
                Seconds *
              </label>
              <div className="mt-2">
                <div className="input-group">
                  <input
                    type="text"
                    name="sec"
                    id="scheduleSec"
                    value={formData.sec}
                    onChange={handleFormChange}
                    className="input-field"
                    placeholder="e.g. 15"
                    required
                  />
                </div>
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
                    onChange={handleSystemChange}
                    autoComplete=""
                    className="select-field"
                    required
                  >
                    <option value="" disabled>
                      please select...
                    </option>
                    <Show when={systemList.systems.length > 0} fallback="No system found.">
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
          </div>

          <div className="button-container">
            <button className="button hover:bg-purple/80 bg-purple text-white" disabled={isSubmitting}>
              <Show when={!isSubmitting} fallback="Saving...">
                Save
              </Show>
            </button>
            <button
              className="button cancel hover:text-light-gray/80 text-card-label"
              onClick={() => setIsNewScheduleOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewSchedule;
