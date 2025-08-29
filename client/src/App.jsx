import React, { useContext } from 'react'
import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import { AppContext } from './context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
const App = () => {
  
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        
      </Routes>
    </div>
  )
}

export default App
