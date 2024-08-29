import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import TaskList from './components/TaskList';
import AdminTask from './components/AdminTask';
import ProtectedRoutes from './utils/ProtectedRoutes'; // Ensure this file exists and is correctly implemented
import TableComponent from './components/TableComponent';
import Sidebar from './components/Slidebar';

function App() {
  const isLoggedIn = !!window.localStorage.getItem('Token');
  const userType = window.localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} userType={userType} />}>
              {userType === 'user' ? (
                <>
                  <Route path="/task" element={<TaskList />} />
                  <Route path="/" element={<Navigate to="/task" />} />
                  <Route path="/admin" element={<Navigate to="/task" />} />
                  
                </>
              ) : (
                <>
                  <Route path="/admin" element={<AdminTask />} />
                  <Route path="/" element={<Navigate to="/admin" />} />
                  <Route path="/task" element={<Navigate to="/admin" />} />
                </>
              )}
            </Route>
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
