interface Props {
  setIsNewScheduleOpen: (value: boolean) => void;
}
const AddNewSchedule = ({ setIsNewScheduleOpen }: Props) => {
  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        <h2>Create Schedule</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-5">
            <label htmlFor="scheduleName" className="block">
              Schedule name:
            </label>
            <div className="mt-2">
              <div className="input-group">
                <input
                  type="text"
                  name="scheduleName"
                  id="scheduleName"
                  className="input-field"
                  placeholder="e.g. water pump afternoon sched"
                />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="scheduleExpression" className="block">
              Cron Expression:
            </label>
            <div className="mt-2">
              <div className="input-group">
                <input
                  type="text"
                  name="scheduleExpression"
                  id="scheduleExpression"
                  className="input-field"
                  placeholder="e.g. 5 * * * * *"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="mb-5 w-1/3">
              <label htmlFor="scheduleMin" className="block">
                Minutes:
              </label>
              <div className="mt-2">
                <div className="input-group">
                  <input type="text" name="scheduleMin" id="scheduleMin" className="input-field" placeholder="e.g. 30" />
                </div>
              </div>
            </div>
            <div className="mb-5 w-1/3">
              <label htmlFor="scheduleSec" className="block">
                Seconds:
              </label>
              <div className="mt-2">
                <div className="input-group">
                  <input type="text" name="scheduleSec" id="scheduleSec" className="input-field" placeholder="e.g. 15" />
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
                  <select id="selectedSystem" name="selectedSystem" autoComplete="" className="select-field" required>
                    <option value="" disabled selected>
                      please select...
                    </option>
                    <option value="">Water system</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div></div>
          <div className="button-container">
            <button className="button bg-purple text-white">Save</button>
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
