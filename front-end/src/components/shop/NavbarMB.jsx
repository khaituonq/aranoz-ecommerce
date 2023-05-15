import { useContext } from 'react'
import { FaTimes } from 'react-icons/fa'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'

import { Store } from '../../Store'

const NavbarMB = ({setShowNav, active}) => {
  const navigate = useNavigate()
  const {state, dispatch} = useContext(Store)
  const {userInfo} = state

  const logoutHandler = () => {
    if (userInfo) {
      dispatch({type: "USER_SIGN_OUT"})
      navigate('/auth')
    }
  }

  document.querySelectorAll('.nav-content li').forEach(item => {
    item.addEventListener('click', () => setShowNav(false))
  })

  return (
    <section className={`nav-mb ${active}`}>
      <div className='nav-top'>
        <h2 className='brand-mb'>Aranoz.</h2>
        <button onClick={() =>  setShowNav(false)}>
          <FaTimes/>
        </button>
      </div>

      <ul className='nav-content'>
        {userInfo && userInfo.isAdmin && <li className='fw-light'>Admin</li>}
        <li>
          <Link className='search d-flex justify-content-between' to='/search'>Search<MdKeyboardArrowRight/></Link>
        </li>
        {userInfo ? <li onClick={logoutHandler} className='d-flex justify-content-between cursor-pointer'><h6>Logout</h6><MdKeyboardArrowRight/></li> :  
        <li><Link className='d-flex justify-content-between cursor-pointer' to='/auth'><h6>Login</h6><MdKeyboardArrowRight/></Link></li>}
      </ul>
    </section>
  )
}

export default NavbarMB