import { useContext, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'
import { AiOutlineLogout } from 'react-icons/ai'
import { BiSearch } from 'react-icons/bi'
import { BsList } from 'react-icons/bs'
import { FaRegUserCircle, FaShoppingCart, FaUserCircle } from 'react-icons/fa'
import { IoIosArrowForward } from 'react-icons/io'
import { Link, useNavigate } from "react-router-dom"

import { Store } from '../../Store'

import NavbarMB from './NavbarMB'

const Header = () => {
  const { state, dispatch } = useContext(Store)
  const { userInfo, cart: {cartItems} } = state
  const navigate = useNavigate()

  const [showNav, setShowNav] = useState(false)

  const logoutHandler = () => {
    if (userInfo) {
      dispatch({type: "USER_SIGN_OUT"})
      navigate('/auth')
    }
  }


  return (
    <header>
      <NavbarMB active={showNav ? "active" : ""} setShowNav={setShowNav}/>
      <Container>
        <Row>
          <Col md={4} xs={4} className="col-list">
             <button onClick={() => setShowNav(true)}>
              <BsList/>
            </button>
          </Col>

          <Col lg={3} md={4} xs={4}>
            <Link to='/' className='brand'>Aranoz.</Link>
          </Col>
          
          <Col lg={6} className="col-menu">
            {/* <ul className='menu'>
              <li>Home</li>
              <li>Shop</li>
              <li>Page</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul> */}
          </Col>
          
          <Col lg={3} md={4} xs={4}>
            <ul className='d-flex util-menu align-items-center'>
              <Link className='search' to='/search'><BiSearch/></Link>
              <Link to='/cart'><FaShoppingCart/>{cartItems.length > 0 && <span align="center">{cartItems.length}</span>}</Link>
              <li className='list'>
                {userInfo ? 
                  userInfo.isAdmin ? (
                    <Dropdown>
                      <Dropdown.Toggle variant='secondary' className='d-flex align-items-center gap-2'>
                        <FaUserCircle/><h6>Logout</h6>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.ItemText>Admin</Dropdown.ItemText>
                        <Dropdown.Item><Link to="/dashboard" className='d-flex align-items-center justify-content-between'>Dashboard <IoIosArrowForward/></Link></Dropdown.Item>
                        {/* <Dropdown.Item><Link to="/favorite" className='d-flex align-items-center justify-content-between'>Favorite <IoIosArrowForward/></Link></Dropdown.Item> */}
                        <Dropdown.Item className='d-flex align-items-center justify-content-between' onClick={logoutHandler}>Logout <AiOutlineLogout/></Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <Dropdown>
                      <Dropdown.Toggle variant='secondary' className='d-flex align-items-center gap-2'>
                        <FaUserCircle/><h6>Logout</h6>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        {/* <Dropdown.Item><Link to="/favorite" className='d-flex align-items-center justify-content-between'>Favorite <IoIosArrowForward/></Link></Dropdown.Item> */}
                        <Dropdown.Item className='d-flex align-items-center justify-content-between' onClick={logoutHandler}>Logout <AiOutlineLogout/></Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )
                : <Link to="/auth"><button className='d-flex align-items-center gap-2'><h6>Login</h6><FaRegUserCircle/></button></Link>}
              </li>
            </ul>
          
          </Col>
        </Row>
      </Container>
    </header>
  )
}

export default Header