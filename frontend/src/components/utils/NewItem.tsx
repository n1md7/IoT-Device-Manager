import AddIcon from '../../icons/AddIcon.tsx';

type Props = {
  item: string;
  btnAction: () => void;
};
const NewItem = ({ item, btnAction }: Props) => {
  return (
    <button className="card-item cursor-pointer" onClick={() => btnAction}>
      <div className="card-body new-item">
        <div className="icon button-add-item">
          {' '}
          <AddIcon className="text-light-dark" />{' '}
        </div>
        <div className="text">Add New {item}</div>
      </div>
    </button>
  );
};

export default NewItem;
