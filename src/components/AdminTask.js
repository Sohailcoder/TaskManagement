import {React,useState,useEffect} from 'react'
import TaskDetails from './TaskDetails';
import Sidebar from './Slidebar';
import { Navigate, useNavigate } from 'react-router-dom';

function AdminTask() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch users and their tasks from the API
    fetch('https://taskmanagement-crsm.onrender.com/api/tasks/all-users-tasks') // Adjust the API endpoint as needed
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleUserSelect = (email) => {
    const user = users.find(user => user[0] === email);
    setSelectedUser(email);
    console.log(selectedUser);
    setTasks(user ? user[1] : []);
  };
  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("role");
    navigate("/login");
    window.location.reload();
  };
  return (
    <div className="flex">
      
      <Sidebar users={users} onUserSelect={handleUserSelect} />
      <div className="flex-1">
        <div className='float-end mr-10 mt-6'>
        <button
              onClick={handleLogout}
              type="button"
              className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
            >
              Logout
            </button>
        </div>
        {selectedUser ? (
          <TaskDetails tasks={tasks} />
        ) : (
          <p className="p-6 text-gray-600">Please select a user to view their tasks</p>
        )}
      </div>
    </div>
  )
}

export default AdminTask