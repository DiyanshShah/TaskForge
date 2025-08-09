import { Children, StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import DashboardPage from './Pages/DashboardPage.jsx'
import LoginPage from './Pages/LoginPage.jsx'
import RegisterPage from './Pages/RegisterPage.jsx'
import ProtectedRoute from './Components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children:[
      {path: '/login', element: <LoginPage/> },
      {path: '/register', element: <RegisterPage/> },
      
      {
        element: <ProtectedRoute/>,
        children: [
          {index: true, element: <DashboardPage/>},
        ]
      }
    ] 
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
