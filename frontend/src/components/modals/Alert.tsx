import { useAlert } from '@src/hooks/useAlert';
import { AlertType } from '@src/atoms/alertAtoms';
import { Show } from '@src/components/utils/Show';

const classes: Record<AlertType, string> = {
  success: 'text-light-purple',
  info: 'text-blue-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
};

const Alert = () => {
  const alert = useAlert();

  if (!alert.show) return null;
  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        <div className="status-div fade-in" style={{ animationDelay: `0.05` }}>
          <div>
            <h2 className={classes[alert.type]}>{alert.title}</h2>
            <p> {alert.message} </p>
          </div>
          <Show when={alert.type === 'error'}>
            <div className="error-details">
              <span className="text-red-600">{alert.errorMessage}: </span>
              <span className="text-gray-500">{alert.errorDetails}</span>
            </div>
          </Show>
          <div className="button-container">
            <button className="button bg-purple text-white mt-4" onClick={alert.hideAlert}>
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
