import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

import { applyChartTheme } from './chartTheme.js'
import './index.css'

// Apply Chart.js dark theme defaults
applyChartTheme()

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60_000,
      retry: 1,
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <Products /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
