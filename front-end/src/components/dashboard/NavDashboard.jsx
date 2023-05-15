import React, { useContext } from 'react'
import { FaHome, FaProductHunt, FaThList, FaUserFriends } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

import { Store } from '../../Store'

const NavDashboard = () => {
  const location = useLocation()
  const lastPath = location.pathname.split('/')[2]
  const { state } = useContext(Store)
  const { userInfo } = state
  
  return (
    <section className='d-flex flex-column justify-content-between nav-dashboard'>
      <div className='d-flex flex-column justify-content-between wrap'>
        <h4>Aranoz</h4>
        
        <div className='admin-info'>
          <img src="/images/avatar/admin-avatar.jpg" alt="" />
          <h5>{userInfo.name}</h5>
          <h6>Admin</h6>
        </div>
        
        <ul className='d-flex flex-column align-items-center'>
          <Link to="/dashboard" className={`${!lastPath ? "active" : ""}`}><FaHome/><span>Dashboard</span></Link>
          <Link to="/dashboard/products" className={`${lastPath === "products" ? "active" : ""}`}><FaProductHunt/><span>Product</span></Link>
          <Link to="/dashboard/orders" className={`${lastPath === "orders" ? "active" : ""}`}><FaThList/><span>Order</span></Link>
          <Link to="/dashboard/users" className={`${lastPath === "users" ? "active" : ""}`}><FaUserFriends/><span>User</span></Link>
        </ul>
      </div>

      <Link to="/" className='d-flex align-items-center gap-2 exit'><FiLogOut/><span>Exit</span></Link>
    </section>
  )
}

export default NavDashboard