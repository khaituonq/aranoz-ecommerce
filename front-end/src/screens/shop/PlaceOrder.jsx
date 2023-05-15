import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'

import { Store } from '../../Store'
import CheckoutSteps from '../../components/CheckoutSteps'
import LoadingBox from '../../components/LoadingBox'
import Layout from '../../components/shop/Layout'

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true}
    case 'CREATE_SUCCESS':
      return { ...state, loading: false}
    case 'CREATE_FAIL':
      return { ...state, loading: false}
    default:
      break;
  }
}

const PlaceOrder = () => {
  const navigate = useNavigate()
  const [{loading}, dispatch] = useReducer(reducer, {loading: false})
  const {state} = useContext(Store)
  const {cart} = state
  const cookies = new Cookies()



  /**
   * The function "round2" rounds a number to two decimal places.
   */
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100
  



  cart.itemsPrice = round2(cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0))
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : cart.cartItems.length === 0 ? round2(0) : round2(10)
  cart.taxPrice = round2(0.15 * cart.itemsPrice)
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice



  /**
   * This function places an order by sending a POST request to the server with the necessary order
   * details and handles any errors that may occur.
   */
  const placeOrder = async() => {
    try {
      dispatch({type: 'CREATE_REQUEST'})
      const { data } = await axios.post(`/api/order`, {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${cookies.get('aranoz-token')}`
        }
      })
      dispatch({type: 'CREATE_SUCCESS'})
      navigate(`/order/${data.order._id}`)
    } catch (error) {
      dispatch({type: 'CREATE_FAIL'})
      console.log(error)
      toast.error('Place order failed')
    }
  }



  /* This `useEffect` hook is checking if the `paymentMethod` property in the `cart` object is falsy.
  If it is, it navigates the user to the `/payment` page using the `navigate` function from the
  `react-router-dom` library. The `useEffect` hook is also dependent on the `cart` and `navigate`
  variables, so it will re-run whenever either of those variables change. */
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate(`/payment`)
    }
  },[cart, navigate])



  return (
    <Layout title="Place Order">
      <CheckoutSteps step1 step2 step3 step4/>
      <Container className='placeorder-screen'>
        <h2 className="my-3">Preview Order</h2>
        <Row>
          {/* LEFT content */}
          <Col md={8}>
            <Card className='mb-3'>
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>
                  <strong>Name: </strong> { cart.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                </Card.Text>
                <Link to='/shipping' className='edit'>Edit</Link>
              </Card.Body>
            </Card>

            <Card className='mb-3'>
              <Card.Body>
                <Card.Title>Items</Card.Title>
                <ListGroup variant="flush">
                  {cart.cartItems.map(item => (
                    <ListGroup.Item key={item._id}>
                      <Row className='align-items-center'>
                        <Col md={6} className='d-flex align-items-center gap-2 wrap-img'>
                          <img src={item.image.secure_url} alt={item.name} className='img-fluid rounded img-thumbnail image'/>
                          <Link to={`/product/${item.slug}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={3} xs={6} className='d-flex justify-content-center'>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col md={3} xs={6} className='d-flex justify-content-center'>${item.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Link to='/cart' className='edit'>Edit</Link>
              </Card.Body>
            </Card>
          </Col>

          {/* RIGHT content */}
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title className='text-center'>Order Summary</Card.Title>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${cart.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${cart.shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${cart.taxPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col><strong>Order Total</strong></Col>
                      <Col><strong>${cart.totalPrice.toFixed(2)}</strong></Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <div className='d-grid'>
                        <Button
                          onClick={placeOrder}
                          disabled={cart.cartItems.length === 0}
                          variant='dark'
                        >
                          Place Order
                        </Button>
                      </div>
                      {loading && <LoadingBox/>}
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export default PlaceOrder