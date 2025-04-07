import * as React from 'react';
import { useEffect, useState } from 'react';
import useSchedule from '../hooks/useSchedule.ts';
import useSystems from '../hooks/useSystem.ts';

interface Props {
  setIsNewScheduleOpen: (value: boolean) => void;
  refetch: () => void;
}
const AddNewSchedule = ({ setIsNewScheduleOpen, refetch }: Props) => {
  const { addSchedule, isSubmitting, scheduler } = useSchedule();
  const { systemList } = useSystems();
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [addedSchedule, setAddedSchedule] = useState<{ name: string } | null>(null);

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
      setIsFailed(true);
      setErrorDetail(scheduler.error.details ?? 'Unknown error details.');
      setErrorMessage(scheduler.error.message ?? 'Unknown error message.');
    }
  }, [scheduler.error]);

  useEffect(() => {
    if (scheduler.data) {
      setAddedSchedule({ name: scheduler.data.name });
      setIsSuccess(true);
    }
  }, [scheduler.data]);

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        {isSuccess && (
          <div className="status-div fade-in" style={{ animationDelay: `0.05` }}>
            <div>
              <h2 className="">Successfully Added</h2>
              {addedSchedule && (
                <p>
                  New schedule <strong className="text-purple">{addedSchedule.name}</strong> has been added!
                </p>
              )}
            </div>
            <div className="button-container">
              <button
                className="button bg-purple text-white mt-4"
                onClick={() => {
                  refetch();
                  setIsNewScheduleOpen(false);
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
              <p>There seems to be a problem while adding a new schedule.</p>

              <div className="error-details">
                <span className="text-red-600">{errorMessage}: </span>
                <span className="text-gray-500">{errorDetail}</span>
              </div>
            </div>
            <div className="button-container">
              <button
                className="button bg-light-gray text-purple mt-4"
                onClick={() => {
                  setIsNewScheduleOpen(false);
                }}
              >
                Okay
              </button>
            </div>
          </div>
        )}{' '}
        {!isSuccess && !isFailed && (
          <>
            <h2>Create Schedule</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="name" className="block">
                  Schedule name:
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
                  Cron Expression:
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
                    Minutes:
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
                    Seconds:
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
                    Select system:
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
              </div>

              <div></div>
              <div className="button-container">
                <button className="button bg-purple text-white" disabled={isSubmitting}>
                  Save
                </button>
                <button className="button bg-light-gray text-purple" onClick={() => setIsNewScheduleOpen(false)}>
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

export default AddNewSchedule;
