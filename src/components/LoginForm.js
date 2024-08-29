import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '', // Added role field
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email Address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.role) newErrors.role = 'Role selection is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setSuccessMessage('');

    try {
      // Replace with your API endpoint
      const response = await fetch('https://taskmanagement-crsm.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    
      if (response.ok) {
        const result = await response.json();
        
        Swal.fire({
          title: 'Success',
          text: result.message || 'Login successful!',
          icon: 'success',
        });

    
        // Store the token in localStorage
        const token = result.token; // Access the token from the result
        const role = result.role; // Access the token from the result
        localStorage.setItem('Token', token); // Store it with the key 'authToken'
        localStorage.setItem('role', role); // Store it with the key 'authToken'
    
        setFormData({ email: '', password: '', role: '' });
        role === 'user' ?navigate('/task'):navigate('/admin');
        window.location.reload();
      } else {
        const error = await response.json();
        Swal.fire({
          title: 'Error',
          text: error.error || 'An error occurred. Please try again.',
          icon: 'error',
        });
        setErrors({ api: error.message });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'An error occurred. Please try again.',
        icon: 'error',
      });
      setErrors({ api: 'An error occurred. Please try again.' });
    }
  }    

  return (
    <div className="gradient-bg h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Login to Your Account</h1>

        {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}
        {errors.api && <p className="text-red-500 mb-4 text-center">{errors.api}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="example@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="********"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-2">Select Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="" disabled>Select your role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 transition duration-150 ease-in-out"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account? <a href="/signup" className="text-blue-500 hover:text-blue-600 font-semibold">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
