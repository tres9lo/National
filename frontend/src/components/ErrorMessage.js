import React from 'react';

function ErrorMessage({ message }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
      <p>Error: {message}</p>
    </div>
  );
}

export default ErrorMessage;