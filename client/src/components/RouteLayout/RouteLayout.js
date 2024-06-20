import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import './RouteLayout.css'
function RouteLayout() {
  return (
    <div className='routlay'>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default RouteLayout