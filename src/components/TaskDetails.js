import React from 'react';

const TaskDetails = ({ tasks }) => {
  return (
    <div className="flex-1 p-6">
      <h3 className="text-xl font-semibold mb-6">Tasks</h3>
      {tasks.length > 0 ? (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task._id} className="p-4 bg-white rounded shadow">
              <h4 className="text-lg font-bold">{task.title}</h4>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-sm">Status: {task.status}</p>
              <p className="text-sm">Date: {new Date(task.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No tasks available</p>
      )}
    </div>
  );
};

export default TaskDetails;
