import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isLoggedIn, component: Component }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;