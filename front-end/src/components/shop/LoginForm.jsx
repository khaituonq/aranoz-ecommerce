/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'

import { Store } from '../../Store'
import { useLocation, useNavigate } from 'react-router-dom'

const LoginForm = ({setShowForm}) => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const cookies = new Cookies()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { state, dispatch }  = useContext(Store)
  const { userInfo } = state

  const submitHandler = (e) => {
    e.preventDefault()
    axios({
      method: "POST",
      url: "/api/user/login",
      data: {
        email, password
      }, 
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(res => {
      dispatch({type: 'USER_SIGN_IN', payload: res.data.token})
      cookies.set('aranoz-token', res.data.token, {path: '/', maxAge: 864000})
      navigate(redirect || '/')
    })
    .catch(() => toast.error("Login failed"))  
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  },[navigate, redirect, userInfo])

  return (
    <div className="form-container sign-in-container">
      <form action="#">
        <h1>Sign in</h1>
        <div className="social-container">
          <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
          <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
        </div>
        <span>or use your account</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" autoComplete="true"/>
        <a href="#">Forgot your password?</a>
        <div className='d-flex justify-content-center gap-2'>
          <button onClick={submitHandler}>Sign In</button>
          <button onClick={() => setShowForm(true)} className='signup-mb'>Sign Up</button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm