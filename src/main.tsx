import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Home from './pages/Home/home';
import Login from './pages/Login/index';
import Register from './pages/Register/index';
import {RouterProvider, createBrowserRouter} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/dbc/",
    element: <App/>,
    children: [
      {
        path: "/dbc/",
        element: <Login/>
      },
      {
        path: "/dbc/register",
        element: <Register/>
      },
      {
        path: "/dbc/home",
        element: <Home/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
