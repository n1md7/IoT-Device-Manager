import { ReactElement, useState } from 'react';
import { Show } from '@src/components/utils/Show';
import EditIcon from '@src/icons/EditIcon';
import AddNewDevice from '@src/components/modals/AddNewDevice';
import useDevice from '@src/hooks/useDevice.ts';
import NewItem from '@src/components/utils/NewItem';
import DeleteIcon from '@src/icons/DeleteIcon';

const ManageDevice = () => {
  const [showModal, setShowModal] = useState<ReactElement | null>(null);
  const [isNewDeviceOpen, setIsNewDeviceOpen] = useState(false);
  const { deviceList } = useDevice();

  const handleNewDeviceView = (componentId?: string) => {
    setIsNewDeviceOpen(true);
    const title = componentId ? 'Update' : 'Create';
    setShowModal(<AddNewDevice setIsNewDeviceOpen={setIsNewDeviceOpen} selectedId={componentId} actionTitle={title} />);
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
                <button className="delete-button" onClick={() => {}}>
                  <DeleteIcon className={'#4f4f4f'} />
                </button>
                <button className="edit-button" onClick={() => handleNewDeviceView(device.code)}>
                  <EditIcon className={'text-icon'} />
                </button>
              </div>
            </div>
          ))}
        </Show>

        <NewItem item={'Device'} btnAction={() => handleNewDeviceView()} />
      </div>
      <Show when={deviceList.devices.length <= 0}>
        <div className="pt-5 error-msg">No available data.</div>
      </Show>
      {isNewDeviceOpen && <div className="block">{showModal}</div>}
    </>
  );
};

export default ManageDevice;
