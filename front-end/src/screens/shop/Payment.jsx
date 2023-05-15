import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { Store } from '../../Store'
import CheckoutSteps from '../../components/CheckoutSteps'
import Layout from '../../components/shop/Layout'

const Payment = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const { cart: { shippingAddress, paymentMethod}} = state
  const [paymentMethodName, setPaymentMethodName] = useState(paymentMethod || 'paypal')

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate(`/shipping`)
    }
  },[shippingAddress, navigate])


  const submit = async(e) => {
    e.preventDefault()
    dispatch({type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName})
    navigate('/placeorder')
  }

  return (
    <Layout title='Payment'>
      <CheckoutSteps step1 step2 step3/>
      <Container className='payment-screen'>
        <h2 className='my-3'>Payment method</h2>
        <Form onSubmit={submit}>
          <div className='mb-3'>
            <Form.Check
              type='radio'
              id='Paypal'
              label='Paypal'
              value='Paypal'
              checked={paymentMethodName === 'Paypal'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <Form.Check
              type='radio'
              id='Stripe'
              label='Stripe'
              value='Stripe'
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <Button type="submit" variant='dark'>Continue</Button>
          </div>
        </Form>
      </Container>
    </Layout>
  )
}

export default Payment