import React from 'react';

function SuccessMessage({ message, onClose }) {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded mb-4 flex justify-between">
      <p>{message}</p>
      {onClose && <button onClick={onClose} className="text-green-700 hover:underline">Close</button>}
    </div>
  );
}

export default SuccessMessage;