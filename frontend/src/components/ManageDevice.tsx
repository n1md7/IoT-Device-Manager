import { ReactElement, useState } from 'react';
import EditIcon from '../icons/EditIcon.tsx';
import AddNewDevice from './modals/AddNewDevice.tsx';
import useDevice from '../hooks/useDevice.ts';
import NewItem from './utils/NewItem.tsx';
import { Show } from './utils/Show.tsx';
//import DeleteIcon from '../icons/DeleteIcon.tsx';

const ManageDevice = () => {
  const [showModal, setShowModal] = useState<ReactElement | null>(null);
  const [isNewDeviceOpen, setIsNewDeviceOpen] = useState(false);
  const { deviceList } = useDevice();

  const handleNewDeviceView = () => {
    setIsNewDeviceOpen(true);
    setShowModal(<AddNewDevice setIsNewDeviceOpen={setIsNewDeviceOpen} />);
  };

  return (
    <>
      <div className="control-view-container">
        <Show when={deviceList.devices.length > 0}>
          {deviceList.devices.map((device, index) => (
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
          ))}
        </Show>

        <NewItem item={'Device'} btnAction={handleNewDeviceView} />
      </div>
      <Show when={deviceList.devices.length <= 0}>
        <div className="pt-5 error-msg">No available data.</div>
      </Show>
      {isNewDeviceOpen && <div className="block">{showModal}</div>}
    </>
  );
};

export default ManageDevice;
