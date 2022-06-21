import React from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import useAuth, { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import CompilerPage from './views/CompilerPage';
import Login from './views/Login';
import Register from './views/Register';
import UserPage from './views/UserPage';
import ChangePassword from './views/ChangePage';

const Routes = () => {

  const [, checkAuth] = useAuth();

  return (
    <>
      <Navbar />
      <RouterRoutes>
        <Route element={checkAuth() !== "login" ? <CompilerPage /> : <Login />} index />
        <Route element={<UserPage />} path="/users" />
        <Route element={<Register />} path="/register" />
        <Route element={<ChangePassword />} path="/change-password" />
      </RouterRoutes>
    </>
  );
};

export default Routes;