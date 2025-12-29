import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import EngineerDashboard from './pages/engineer/EngineerDashboard'
import UserDashboard from "./pages/user/UserDashboard"
import CreateEngineer from './pages/admin/CreateEngineer'
import UsersPage from './pages/admin/UsersPage'
import EngineersPage from './pages/admin/EngineersPage'
import CreateTicket from './pages/user/CreateTicket'
import TicketReplies from './pages/user/TicketReplies'
import Settings  from './pages/Settings'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        { /* auth Routes */ }
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<Settings />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/engineers/new" element={<CreateEngineer />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/engineers" element={<EngineersPage />} />

        { /* Engineer Routes */ }
        <Route path="/engineer/dashboard" element={<EngineerDashboard />} />

        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/tickets/new" element={<CreateTicket />} />
        <Route path="/user/tickets/:ticketId/replies" element={<TicketReplies />}


/>

      </Routes>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>

  )
}


export default App
