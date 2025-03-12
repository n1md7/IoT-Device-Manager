import EditIcon from '../icons/EditIcon.tsx';
import useComponent from '../hooks/useComponent.ts';

const ManageComponent = () => {
  const { componentList, error, loading } = useComponent();

  if (loading) return <p className="loading-msg">Loading system...</p>;
  if (error) return <p className="error-msg">Error: {error}</p>;

  return (
    <div className="control-view-container">
      {componentList?.length ? (
        componentList.map((component) => (
          <div key={component.id} className="card-item">
            <div className="card-header">
              <form className="system-details">
                <label htmlFor="edit-component-id" className="system-name text-green">
                  {component.device.name}
                </label>
                <button id="edit-component-id" className="edit-button">
                  <EditIcon className={'text-light-gray'} />
                </button>
              </form>
            </div>
            <div className="card-body">
              <div className="item-data">
                <div className="">Device code:</div>
                <div className="text-light-gray font-bold">{component.device.code}</div>
              </div>
              <div className="item-data">
                <div className="">Device type:</div>
                <div className="text-light-gray">{component.device.type}</div>
              </div>
              <div className="item-data">
                <div className="">System:</div>
                <div className="text-light-gray">{component.system.name}</div>
              </div>
              <div className="item-data">
                <div className="">Shareable:</div>
                <div className="text-light-gray">{component.shared ? '✅ Yes' : '⛔ No'}</div>
              </div>
              <div className="item-data">
                <div className="">In use:</div>
                <div className="text-light-gray">{component.inUse ? '🟢 Yes' : '🔴 No'}</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No components found. </p>
      )}
    </div>
  );
};

export default ManageComponent;
