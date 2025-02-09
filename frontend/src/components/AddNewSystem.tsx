import { useState } from 'react';

const AddNewSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button className="button bg-purple text-white" onClick={() => setIsOpen(true)}>Add System</button>

      {isOpen && (
        <div className='h-full bg-amber-50'>Test</div>
      )}
    </>
  )
}

export default AddNewSystem;