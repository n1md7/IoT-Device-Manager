import { ReactElement, useEffect, useState } from 'react';
import { Show } from '@src/components/utils/Show';
import { Nullable } from '@src/types/utilsType';
import EditIcon from '@src/icons/EditIcon';
import AddNewSchedule from '@src/components/modals/AddNewSchedule';
import NewItem from '@src/components/utils/NewItem';
import useSchedule from '@src/hooks/useSchedule';
import DeleteIcon from '@src/icons/DeleteIcon';
import Confirmation from '@src/components/modals/Confirmation';
import useDisplayAlert from '@src/hooks/useDisplayAlert';

const ManageSchedule = () => {
  const { scheduleList, removeSchedule, deletedItem, deletingError, reset, isSubmitting } = useSchedule();
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [showModal, setShowModal] = useState<ReactElement | null>(null);
  const [selectedId, setSelectedId] = useState<Nullable<number>>(null);
  const [selectedScheduleName, setSelectedScheduleName] = useState<Nullable<string>>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { displaySuccess, displayError } = useDisplayAlert();

  const handleNewScheduleView = (scheduleId?: number) => {
    setIsNewScheduleOpen(true);
    const title = scheduleId ? 'Update' : 'Create';
    setShowModal(<AddNewSchedule setIsNewScheduleOpen={setIsNewScheduleOpen} selectedId={scheduleId} actionTitle={title} />);
  };

  const handleDeleteItem = (id: Nullable<number>, schedule: Nullable<string>) => {
    if (id && schedule) {
      removeSchedule(id, schedule).then(() => {
        setShowConfirmation(false);
      });
    }
  };

  useEffect(() => {
    if (deletedItem && !isSubmitting) {
      reset();
      displaySuccess({
        actionText: 'deleted',
        item: `${deletedItem} schedule`,
      });
    }
  }, [deletedItem, displaySuccess, isSubmitting, reset]);

  useEffect(() => {
    if (deletingError) {
      reset();
      displayError({
        actionText: 'deleting',
        errorMessage: deletingError.message,
        errorDetails: deletingError.details,
      });
    }
  }, [deletingError, displayError, reset]);

  return (
    <>
      <div className="control-view-container">
        <Show when={scheduleList.schedules.length > 0}>
          {scheduleList.schedules.map((schedule, index) => (
            <div key={schedule.id} className="card-item fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="card-header">
                <div className="system-details">
                  <div className="system-name text-green">{schedule.name}</div>
                  <span className="uppercase text-green">ON</span>
                </div>
                <div className="system-desc">{schedule.system?.description}</div>
              </div>
              <div className="card-body">
                <div className="item-data">
                  <div className="">System:</div>
                  <div className="text-light-gray font-bold">{schedule.system?.name}</div>
                </div>
                <div className="item-data">
                  <div className="">Duration:</div>
                  <div className="text-light-gray font-bold">
                    {schedule.duration.min}:{schedule.duration.sec}
                  </div>
                </div>
                <div className="item-data">
                  <div className="">Component:</div>
                  <div className="text-light-gray font-bold text-right">
                    {schedule.system?.components.map((component) => component.device.name).join(', ')}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="my-5">
                  <label htmlFor="remainingTime" className="block">
                    Remaining time:
                  </label>
                  <div className="mt-2">
                    <div className="input-group">
                      <input
                        type="text"
                        name="remainingTime"
                        id="remainingTime"
                        className="input-field timer-count"
                        placeholder="00:00"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="card-controls">
                  <button className="control-button bg-green">Turn OFF</button>
                </div>
              </div>
              <div className="card-tool">
                <button
                  className="delete-button"
                  onClick={() => {
                    setSelectedId(schedule.id);
                    setSelectedScheduleName(schedule.name);
                    setShowConfirmation(true);
                  }}
                >
                  <DeleteIcon className={'#4f4f4f'} />
                </button>
                <button
                  className="edit-button"
                  onClick={() => {
                    handleNewScheduleView(schedule.id);
                  }}
                >
                  <EditIcon className={'text-light-dark'} />
                </button>
              </div>
            </div>
          ))}
        </Show>

        <NewItem item={'Schedule'} btnAction={() => handleNewScheduleView()} />
      </div>
      <Show when={showConfirmation}>
        <Confirmation
          action={() => handleDeleteItem(selectedId, selectedScheduleName)}
          cancel={() => setShowConfirmation(false)}
          itemToDelete={selectedScheduleName ?? 'NO ITEM SELECTED'}
        />
      </Show>
      <Show when={scheduleList.schedules.length <= 0}>
        <div className="pt-5 error-msg">No available data.</div>
      </Show>
      {isNewScheduleOpen && <div className="block">{showModal}</div>}
    </>
  );
};

export default ManageSchedule;
