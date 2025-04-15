import EditIcon from '../icons/EditIcon.tsx';
import AddIcon from '../icons/AddIcon.tsx';
import AddNewDevice from './modals/AddNewDevice.tsx';
import { ReactElement, useState } from 'react';
import useDevice from '../hooks/useDevice.ts';
//import DeleteIcon from '../icons/DeleteIcon.tsx';

const ManageDevice = () => {
  const { deviceList } = useDevice();
  const [isNewDeviceOpen, setIsNewDeviceOpen] = useState(false);
  const [showModal, setShowModal] = useState<ReactElement | null>(null);

  const refetch = () => {
    deviceList.refresh().catch((e) => console.error(e));
  };

  const handleNewDeviceView = () => {
    setIsNewDeviceOpen(true);
    setShowModal(<AddNewDevice setIsNewDeviceOpen={setIsNewDeviceOpen} refetch={refetch} />);
  };

  return (
    <>
      <div className="control-view-container">
        {deviceList?.data?.devices?.length ? (
          deviceList.data.devices.map((device, index) => (
            <div key={device.code} className="card-item fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="card-header">
                <div className="system-details">
                  <div className="system-name text-green">{device.name}</div>
                </div>
              </div>
              <div className="card-body">
                <div className="item-data">
                  <div className="">Code:</div>
                  <div className="text-light-gray font-bold">{device.code}</div>
                </div>
                <div className="item-data">
                  <div className="">Type:</div>
                  <div className="text-light-gray font-bold">{device.type}</div>
                </div>
                <div className="item-data">
                  <div className="">Description:</div>
                  <div className="text-light-gray font-bold">{device.description}</div>
                </div>
                <div className="item-data">
                  <div className="">IP Address:</div>
                  <div className="text-light-gray font-bold">{device.ipAddress}</div>
                </div>
                <div className="item-data">
                  <div className="">Version:</div>
                  <div className="text-light-gray font-bold">{device.version}</div>
                </div>
              </div>

              <div className="card-tool">
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
          <p className="error-msg"> {''}</p>
        )}
        <button className="card-item cursor-pointer" onClick={handleNewDeviceView}>
          <div className="card-body new-item">
            <div className="icon button-add-item">
              {' '}
              <AddIcon className="text-light-dark" />{' '}
            </div>
            <div className="text">Add New Device</div>
          </div>
        </button>
      </div>
      ){isNewDeviceOpen && <div className="block">{showModal}</div>}
    </>
  );
};

export default ManageDevice;
