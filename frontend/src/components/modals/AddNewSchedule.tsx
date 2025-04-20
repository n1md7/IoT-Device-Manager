import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAlert } from '../../hooks/useAlert.ts';
import { Show } from '../utils/Show.tsx';
import useSystems from '../../hooks/useSystem.ts';
import useSchedule from '../../hooks/useSchedule.ts';

interface Props {
  setIsNewScheduleOpen: (value: boolean) => void;
}
const AddNewSchedule = ({ setIsNewScheduleOpen }: Props) => {
  const { addSchedule, isSubmitting, scheduler } = useSchedule();
  const { systemList } = useSystems();
  const { showAlert, hideAlert } = useAlert();
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
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

    if (!selectedSystem) {
      console.error('Selected system not found!');
      return;
    }

    await addSchedule({
      name: formData.name,
      startExpression: formData.startExpression,
      duration: {
        min: Number(formData.min),
        sec: Number(formData.sec),
      },
      systemId: selectedSystem,
    });
  };

  useEffect(() => {
    if (scheduler.error) {
      showAlert({
        type: 'error',
        title: 'Failed',
        message: 'There seems to be a problem while adding the new item.',
        errorMessage: scheduler.error.message,
        errorDetails: scheduler.error.details,
      });
      setIsNewScheduleOpen(false);
    }
  }, [scheduler.error, setIsNewScheduleOpen, showAlert]);

  useEffect(() => {
    if (scheduler.data && !isSubmitting) {
      showAlert({
        type: 'success',
        title: 'Successfully Added',
        message: 'New schedule has been added!',
      });
      setIsNewScheduleOpen(false);
    }
  }, [isSubmitting, scheduler.data, setIsNewScheduleOpen, showAlert, hideAlert]);

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        <h2>Create Schedule</h2>
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
            <button className="button bg-purple text-white">
              <Show when={!isSubmitting} fallback="Saving...">
                Save
              </Show>
            </button>
            <button className="button bg-light-gray text-purple" onClick={() => setIsNewScheduleOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewSchedule;
