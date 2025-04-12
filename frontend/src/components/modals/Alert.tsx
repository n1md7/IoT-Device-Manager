import { useAlert } from '../../hooks/useAlert.ts';
import { AlertType } from '../../atoms/alertAtoms.ts';

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
          <div className="button-container">
            <button className="button bg-purple text-white mt-4" onClick={alert.onClick}>
              {alert.btnText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
