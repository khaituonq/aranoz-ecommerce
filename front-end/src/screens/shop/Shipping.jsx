
import { useContext, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { Store } from '../../Store'
import CheckoutSteps from '../../components/CheckoutSteps'
import Layout from '../../components/shop/Layout'

const Shipping = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const { userInfo, cart: { shippingAddress }} = state
  const [fullName, setFullName] = useState(shippingAddress.fullName || '')
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [country, setCountry] = useState(shippingAddress.country || '')



  /* `useEffect(() => {...})` is a React hook that is used to perform side effects in functional
  components. In this case, it is checking if the `userInfo` object exists in the state. If it does
  not exist, it navigates the user to the authentication page with a redirect to the shipping page.
  The `useEffect` hook is dependent on the `userInfo` and `navigate` variables, so it will only run
  when either of these variables change. */
  useEffect(() => {
    if (!userInfo) {
      navigate(`/auth?redirect=/shipping`)
    }
  }, [userInfo, navigate])



  /**
   * The function saves the shipping address and location to the state and local storage, and navigates
   * to the payment page.
   */
  const submit = (e) => {
    e.preventDefault()
    dispatch({type: 'SAVE_SHIPPING_ADDRESS', payload: {
      fullName,
      address,
      city,
      postalCode,
      country,
      location: shippingAddress.location
    }})

    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
      })
    );
    navigate('/payment');
  }



  return (
    <Layout title="Shipping Address">
      <CheckoutSteps step1 step2/>
      <Container className='shipping-screen'>
        <h2 className="my-3">Shipping Address</h2>
        <Form onSubmit={submit}>
          <Form.Group className='mb-3' controlId='fullName'>
            <Form.Label>Full name</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='address'>
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='city'>
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='postalCode'>
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='country'>
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>
          <div className='mb-3'>
            {/* <Button
              id='chooseOnMap'
              variant='light'
              onClick={() => navigate('/map')}
              className='mb-2'
            >
              Choose Location On Map
            </Button> */}
            {/* {shippingAddress.location && shippingAddress.location.lat ? (
              <div>
                LAT: {shippingAddress.location.lat}
                LNG: {shippingAddress.location.lng}
              </div>
            ): <div>No location</div>} */}
          </div>

          <div className='mb-3 d-flex justify-content-end'>
            <Button type='submit' variant='dark'>
              Continue
            </Button>
          </div>
        </Form>  
      </Container>
    </Layout>
  )
}

export default Shipping