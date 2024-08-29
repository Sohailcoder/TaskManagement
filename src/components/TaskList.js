import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiCheckboxCircleFill, RiCheckboxCircleLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import Swal from "sweetalert2";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateTaskId, setUpdateTaskId] = useState(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDueDate, setUpdateDueDate] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [reload, setReload] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);
  const [totalTasks, setTotalTasks] = useState(0); // Add totalTasks to manage pagination
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("role");
    navigate("/login");
    window.location.reload();
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`https://taskmanagement-crsm.onrender.com/api/tasks?page=${currentPage}&limit=${tasksPerPage}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        if (!response.ok) {
          console.log("Network response was not ok");
          return;
        }

        const data = await response.json();
        setTasks(data.tasks);
        setTotalTasks(data.pagination.totalTasks); // Set totalTasks for pagination
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchTasks();
  }, [currentPage, tasksPerPage, reload]);

  const handleAddTask = async () => {
    if (taskTitle.trim() === "" || !dueDate || description.trim() === "") return;

    try {
      const response = await fetch("https://taskmanagement-crsm.onrender.com/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          title: taskTitle,
          description,
          status: "pending",
          date: dueDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      Swal.fire({
        title: "Success",
        text: "Task added successfully!",
        icon: "success",
      });

      setReload(!reload);
      setTaskTitle("");
      setDueDate("");
      setDescription("");
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleUpdateTask = async () => {
    if (updateTitle.trim() === "" || !updateDueDate || updateDescription.trim() === "") return;

    try {
      const response = await fetch(`https://taskmanagement-crsm.onrender.com/api/tasks/${updateTaskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          title: updateTitle,
          description: updateDescription,
          date: updateDueDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      Swal.fire({
        title: "Success",
        text: "Task updated successfully!",
        icon: "success",
      });

      setReload(!reload);
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const response = await fetch(`https://taskmanagement-crsm.onrender.com/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ status: "completed" }),
      });

      if (!response.ok) {
        console.log("Network response was not ok");
        return;
      }
      Swal.fire({
        title: "Success",
        text: "Task marked as completed!",
        icon: "success",
      });
      setReload(!reload);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to mark task as completed.",
        icon: "error",
      });

    }
  };

  const handleToggleInComplete = async (id) => {
    try {
      const response = await fetch(`https://taskmanagement-crsm.onrender.com/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ status: "pending" }),
      });

      if (!response.ok) {
        Swal.fire({
          title: "Error",
          text: "Task not updated.",
          icon: "error",
        });
      }
      Swal.fire({
        title: "Success",
        text: "Task marked as incomplete!",
        icon: "success",
      });
        
      
      setReload(!reload);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to mark task as incomplete.",
        icon: "error",
      });
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`https://taskmanagement-crsm.onrender.com/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (!response.ok) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete task.",
          icon: "error",
        });

      }
      Swal.fire({
        title: "Success",
        text: "Task deleted successfully!",
        icon: "success",
      });

      setReload(!reload);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to delete task.",
        icon: "error",
      });
    }
  };

  const filteredTasks = (tasks || []).filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const taskDate = new Date(task.date);
  
    const isInRange =
      (!startDate || taskDate >= new Date(startDate)) &&
      (!endDate || taskDate <= new Date(endDate));
  
    return matchesSearch && matchesStatus && isInRange;
  });

  const handlePagination = (direction) => {
    setCurrentPage((prevPage) => {
      if (direction === 'next') {
        return Math.min(prevPage + 1, Math.ceil(totalTasks / tasksPerPage));
      } else {
        return Math.max(prevPage - 1, 1);
      }
    });
  };

  return (
    <div className="bg-custom-gradient min-h-screen flex flex-col">
      <nav className="p-4 text-white shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <div className="space-x-4">
            <button onClick={handleLogout} className="bg-red-500 py-2 px-4 rounded-md hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-col items-center mt-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 mb-4 w-full max-w-md bg-black border-white text-white"
        />

        <div className="flex flex-wrap items-center space-x-4 mb-4">
          <button
            onClick={() => setFilterStatus('all')}
            className={`text-white py-2 px-4 rounded-md ${filterStatus === 'all' ? 'bg-blue-700' : 'bg-gray-600'} hover:bg-blue-800`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`text-white py-2 px-4 rounded-md ${filterStatus === 'pending' ? 'bg-blue-700' : 'bg-gray-600'} hover:bg-blue-800`}
          >
            Uncompleted
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`text-white py-2 px-4 rounded-md ${filterStatus === 'completed' ? 'bg-blue-700' : 'bg-gray-600'} hover:bg-blue-800`}
          >
            Completed
          </button>

          <div className="flex flex-wrap items-center space-x-2 mt-2 md:mt-0">
            <p className='text-white text-xl'>StartDate</p>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-4 py-2 bg-black border-white text-white"
              />
             <p className='text-white text-xl'>EndDate</p>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-4 py-2 bg-black border-white text-white"
            />
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Add Task
        </button>

        <div className="w-full max-w-6xl mt-6 px-4">
          {filteredTasks.length === 0 ? (
            <p className="text-white text-center">No tasks found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 text-white divide-y divide-gray-700">
                  {filteredTasks.map((task) => (
                    <tr key={task._id}>
                      <td className="px-4 py-2">{task.title}</td>
                      <td className="px-4 py-2">{formatDate(task.date)}</td>
                      <td className="px-4 py-2">{task.description}</td>
                      <td className="px-4 py-2">
                        {task.status === "completed" ? (
                          <RiCheckboxCircleFill
                            onClick={() => handleToggleInComplete(task._id)}
                            className="text-green-500 cursor-pointer"
                          />
                        ) : (
                          <RiCheckboxCircleLine
                            onClick={() => handleToggleComplete(task._id)}
                            className="text-red-500 cursor-pointer"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => {
                            setUpdateTaskId(task._id);
                            setUpdateTitle(task.title);
                            setUpdateDueDate((task.date));
                            setUpdateDescription(task.description);
                            setIsUpdateModalOpen(true);
                          }}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <GrUpdate />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="text-red-500 hover:text-red-600 ml-2"
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center w-full max-w-6xl mt-6 px-4">
          <button
            onClick={() => handlePagination('prev')}
            disabled={currentPage === 1}
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-400"
          >
            Previous
          </button>
          <span className="text-white">
            Page {currentPage} of {Math.ceil(totalTasks / tasksPerPage)}
          </span>
          <button
            onClick={() => handlePagination('next')}
            disabled={currentPage === Math.ceil(totalTasks / tasksPerPage)}
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-400"
          >
            Next
          </button>
        </div>

        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black text-white p-6 rounded-md w-full max-w-lg">
              <h2 className="text-xl mb-4">Add Task</h2>
              <input
                type="text"
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="border px-4 py-2 mb-4 w-full bg-black border-white"
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border px-4 py-2 mb-4 w-full bg-black border-white"
              />
              <textarea
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border px-4 py-2 mb-4 w-full bg-black border-white"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleAddTask}
                  className="bg-green-500 py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-red-500 py-2 px-4 rounded-md hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {isUpdateModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black text-white p-6 rounded-md w-full max-w-lg">
              <h2 className="text-xl mb-4">Update Task</h2>
              <input
                type="text"
                placeholder="Task Title"
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                className="border px-4 py-2 mb-4 w-full bg-black border-white"
              />
              <input
                type="date"
                value={updateDueDate}
                onChange={(e) => setUpdateDueDate(e.target.value)}
                className="border px-4 py-2 mb-4 w-full bg-black border-white"
              />
              <textarea
                placeholder="Task Description"
                value={updateDescription}
                onChange={(e) => setUpdateDescription(e.target.value)}
                className="border px-4 py-2 mb-4 w-full bg-black border-white"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleUpdateTask}
                  className="bg-green-500 py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Update
                </button>
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="bg-red-500 py-2 px-4 rounded-md hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
