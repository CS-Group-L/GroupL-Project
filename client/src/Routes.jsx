import React from 'react'
import { Route, Routes as RouterRoutes} from 'react-router-dom';
import Navbar from './components/Navbar';
import CompilerPage from './views/CompilerPage';
import Login from './views/Login';
import UserPage from './views/UserPage';

const Routes = () => {
  return (
      <>
        <Navbar />
        <RouterRoutes>
            <Route element={<CompilerPage />} index />
            <Route element={<Login/>} path="/login"/>
            <Route element={<UserPage/>} path="/users"/>
        </RouterRoutes>
      </>
  )
}

export default Routes