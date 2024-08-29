import React from 'react';

const Sidebar = ({ users, onUserSelect }) => {
  return (
    <div className="w-1/4 h-screen bg-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">Usernames</h3>
      <ul className="space-y-2">
        {users.map((user, index) => (
          <li
            key={index}
            className="cursor-pointer p-2 bg-white rounded shadow hover:bg-gray-100"
            onClick={() => onUserSelect(user[0])}
          >
            {user[0]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
