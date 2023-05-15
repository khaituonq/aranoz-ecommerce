import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import Cookies from 'universal-cookie'

import { Store } from '../../Store'
import { getError } from '../../utils'

const RegisterForm = ({setShowForm}) => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectUrl ? redirectUrl : '/'
  const cookies = new Cookies()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { state, dispatch } = useContext(Store)
  const { userInfo } = state

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match")
    }
    axios({
      method: "POST",
      url: "/api/user/signup",
      data: {
        name, email, password
      },
      headers: {
        "Content-Type" : "application/x-www-form-urlencoded"
      }
    })
    .then(res => {
      dispatch({type: 'USER_SIGN_IN', payload: res.data.token})
      cookies.set('aranoz-token', res.data.token, {path: '/', maxAge: 864000})
      navigate(redirect || '/')
    })
    .catch(err => toast.error(getError(err)))
  }


  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  },[navigate, redirect, userInfo])

  return (
    <div className="form-container sign-up-container">
      <form action="#">
        <h1>Create Account</h1>
        <div className="social-container">
          {/* <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
          <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a> */}
        </div>
        <span>or use your email for registration</span>
        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Name"/>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email"/>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"/>
        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm password"/>
        <div className='d-flex justify-content-center gap-2'>
          <button onClick={submitHandler}>Sign Up</button>
          <button onClick={() => setShowForm(false)} className='signup-mb'>Sign In</button>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm