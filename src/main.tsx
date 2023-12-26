import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {RouterProvider, createBrowserRouter } from 'react-router-dom'

import Register from './pages/Register.tsx'
import Login from './pages/Login.tsx'
import Clients from "./pages/Clients"
import Categories from './pages/Categories'
import Products from "./pages/Products"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {path: "/register", element: <Register/>},
      {path: "/login", element: <Login/>},
      {path: "/", element: <Clients/>},
      {path: "/categories", element: <Categories/>},
      {path: "/products", element: <Products/>},
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>,
)
