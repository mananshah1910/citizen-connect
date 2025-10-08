import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/homepage/Homepage.jsx'
import AddService from './pages/addservice/AddService.jsx'
import AdminLogin from './pages/login/Login.jsx'
import AllService from './pages/service/Service.jsx'



createRoot(document.getElementById('root')).render(

  <BrowserRouter basename="">
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/addservice" element={<AddService/>}></Route>
      <Route path="/login" element={<AdminLogin/>}></Route>
      <Route path="/service" element={<AllService/>}></Route>
    </Routes>
  </BrowserRouter>
)
