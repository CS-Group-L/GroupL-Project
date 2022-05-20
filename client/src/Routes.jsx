import React from 'react'
import { Route, Routes as RouterRoutes} from 'react-router-dom';
import Navbar from './components/Navbar';
import CompilerPage from './views/CompilerPage';

const Routes = () => {
  return (
      <>
        <Navbar />
        <RouterRoutes>
            <Route element={<CompilerPage />} index />
        </RouterRoutes>
      </>
  )
}

export default Routes