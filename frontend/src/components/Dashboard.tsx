import EditIcon from '../icons/EditIcon.tsx';
import useSchedule from '../hooks/useSchedule.ts';
import Welcome from './Welcome.tsx';
import useSystems from '../hooks/useSystem.ts';
import AddIcon from '../icons/AddIcon.tsx';
import AddNewSchedule from './AddNewSchedule.tsx';
import { ReactElement, useState } from 'react';

const Dashboard = () => {
  const { scheduleList, error, loading } = useSchedule();
  const { systemList } = useSystems();
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [showModal, setShowModal] = useState<ReactElement | null>(null);

  if (loading) return <p>Loading schedule...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleNewScheduleView = () => {
    setIsNewScheduleOpen(true);
    setShowModal(<AddNewSchedule setIsNewScheduleOpen={setIsNewScheduleOpen} />);
  };

  return (
    <>
      {systemList?.systems?.length ? (
        <div className="control-view-container">
          {scheduleList?.schedules?.length ? (
            scheduleList.schedules.map((schedule) => (
              <div key={schedule.id} className="card-item">
                <div className="card-header">
                  <div className="system-details">
                    <div className="system-name text-green">{schedule.system?.name}</div>
                    <span className="uppercase text-green">ON</span>
                  </div>
                  <div className="system-desc">{schedule.system?.description}</div>
                </div>
                <div className="card-body">
                  <div className="item-data">
                    <div className="">Schedule name:</div>
                    <div className="text-light-gray font-bold">{schedule.name}</div>
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
                      {scheduleList?.schedules.map((schedule) => (
                        <span key={schedule.id}>
                          {schedule.system?.components
                            .filter((component) => component.inUse)
                            .map((component) => component.device.name)
                            .join(', ')}
                        </span>
                      ))}
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
                </div>
              </div>
            ))
          ) : (
            <p> {error}</p>
          )}
          <button className="card-item cursor-pointer" onClick={handleNewScheduleView}>
            <div className="card-body new-schedule">
              <div className="icon button-add-schedule">
                {' '}
                <AddIcon className="text-light-dark" />{' '}
              </div>
              <div className="text">Add New Schedule</div>
            </div>
          </button>
          {/*<div className="card-item">*/}
          {/*  <div className="card-header">*/}
          {/*    <div className="system-details">*/}
          {/*      <div className="system-name text-orange">Water System</div>*/}
          {/*      <span className="uppercase">OFF</span>*/}
          {/*    </div>*/}
          {/*    <div className="system-desc">A supply system for water tanks.</div>*/}
          {/*  </div>*/}
          {/*  <div className="card-body">*/}
          {/*    <div className="mb-8">*/}
          {/*      <label htmlFor="inputTimer" className="">*/}
          {/*        Set timer:{' '}*/}
          {/*      </label>*/}
          {/*      <input id="inputTimer" type="range" className="input-range" />*/}
          {/*    </div>*/}
          {/*    <div className="text-center">Total duration: 15 minutes</div>*/}
          {/*  </div>*/}
          {/*  <div className="card-tool">*/}
          {/*    <button className="control-button bg-orange">Turn ON</button>*/}
          {/*    <button className="edit-button">*/}
          {/*      <EditIcon className={'text-light-dark'} />*/}
          {/*    </button>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      ) : (
        <Welcome />
      )}
      {isNewScheduleOpen && <div className="block">{showModal}</div>}
    </>
  );
};

export default Dashboard;
