import React, { useContext, useEffect } from 'react'
import { Button, Container } from 'react-bootstrap';
import { BsBagCheckFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { runFireworks } from '../../utils';
import { Store } from '../../Store';

const Success = () => {
  const {dispatch} = useContext(Store)

  useEffect(() => {
    dispatch({type: 'CART_CLEAR'})
    runFireworks()
  },[dispatch])

  return (
    <Container>
      <div className='success-wrapper'>
      <div className='success'>
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order</h2>
        <p className='email-msg'>Check your email inbox for the receipt.</p>
        <p className="description">
          If you have any question, please email
          <a className='email' href="mailto:khaituong2909@gmail.com">khaituong2909@gmail.com</a>
        </p>
        <Link to='/'>
          <Button variant='dark'>
            Continue shopping
          </Button>
        </Link>
      </div>
    </div>
    </Container>
  )
}

export default Success