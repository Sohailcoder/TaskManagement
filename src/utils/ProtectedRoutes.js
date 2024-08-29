import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutes({ isLoggedIn, userType }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Optionally handle different user roles here
  return <Outlet />;
}

export default ProtectedRoutes;
