import EditIcon from '../icons/EditIcon.tsx';
import AddIcon from '../icons/AddIcon.tsx';
import AddNewSchedule from './AddNewSchedule.tsx';
import { ReactElement, useState } from 'react';
import useSchedule from '../hooks/useSchedule.ts';
//import DeleteIcon from '../icons/DeleteIcon.tsx';

const ManageSchedule = () => {
  const { scheduleList } = useSchedule();
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [showModal, setShowModal] = useState<ReactElement | null>(null);

  const refetch = () => {
    scheduleList.refresh().catch((e) => console.error(e));
  };

  const handleNewScheduleView = () => {
    setIsNewScheduleOpen(true);
    setShowModal(<AddNewSchedule setIsNewScheduleOpen={setIsNewScheduleOpen} refetch={refetch} />);
  };

  return (
    <>
      <div className="control-view-container">
        {scheduleList.data?.schedules.length ? (
          scheduleList.data.schedules.map((schedule, index) => (
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
              </div>
              <div className="card-tool">
                <button className="control-button bg-green">Turn OFF</button>

                <button className="edit-button">
                  <EditIcon className={'text-light-dark'} />
                </button>
                {/*TO DO: edit the icon*/}
                {/*<button className="delete-button">*/}
                {/*  <DeleteIcon className={'text-red-300'} />*/}
                {/*</button>*/}
              </div>
            </div>
          ))
        ) : (
          <p className="error-msg"> {scheduleList.error}</p>
        )}
        <button className="card-item cursor-pointer" onClick={handleNewScheduleView}>
          <div className="card-body new-item">
            <div className="icon button-add-item">
              {' '}
              <AddIcon className="text-light-dark" />{' '}
            </div>
            <div className="text">Add New Schedule</div>
          </div>
        </button>
      </div>
      ){isNewScheduleOpen && <div className="block">{showModal}</div>}
    </>
  );
};

export default ManageSchedule;
