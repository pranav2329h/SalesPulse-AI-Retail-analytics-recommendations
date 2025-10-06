import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import './index.css'

const qc = new QueryClient()
const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Dashboard /> },
    { path: 'products', element: <Products /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
  ]},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
