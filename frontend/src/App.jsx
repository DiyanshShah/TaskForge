import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

const App = () => {
  return (
    <div className='bg-slate-900 text-white min-h-screen'>
      <AuthProvider>
      <Outlet />
      </AuthProvider>
    </div>
  )
}

export default App
