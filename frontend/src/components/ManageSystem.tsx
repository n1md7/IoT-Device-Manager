import EditIcon from '../icons/EditIcon.tsx';
import useSystems from '../hooks/useSystem.ts';

const ManageSystem = () => {
  const { systemList, error, loading } = useSystems();

  if (loading) return <p className="loading-msg">Loading system...</p>;
  if (error) return <p className="error-msg">Error: {error}</p>;

  return (
    <div className="control-view-container">
      {systemList?.systems.length ? (
        systemList?.systems.map((system) => (
          <div key={system.id} className="card-item">
            <div className="card-header">
              <form className="system-details">
                <label htmlFor="edit-component-id" className="system-name text-orange">
                  {system.name}
                </label>
                <button id="edit-component-id" className="edit-button">
                  <EditIcon className={'text-light-gray'} />
                </button>
              </form>
            </div>
            <div className="card-body">
              <div className="">
                <div className="text-card-label">System Description:</div>
                <div className="my-1">{system.description}</div>
              </div>
              <div className="mt-3">
                <div className="text-card-label">
                  System ID: <span className="text-white">{system.id}</span>
                </div>
              </div>
              <div className="flex mt-7">
                <div className="text-green font-bold">Components:</div>
                <div className="text-green font-bold ml-2">{system.components.length}</div>
              </div>
              <div className="mt-3">
                <div className="">
                  {system.components.map((component) => (
                    <div key={component.id} className="my-1">
                      ✅ {component.device.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No system found. </p>
      )}
    </div>
  );
};

export default ManageSystem;
