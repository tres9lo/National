import React from 'react';

function ListItem({ item, onEdit, onDelete }) {
  return (
    <li className="bg-white p-3 rounded shadow flex justify-between items-center">
      <span>{item}</span>
      <div>
        {onEdit && (
          <button onClick={onEdit} className="text-blue-600 hover:underline mr-2">Edit</button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="text-red-600 hover:underline">Delete</button>
        )}
      </div>
    </li>
  );
}

export default ListItem;