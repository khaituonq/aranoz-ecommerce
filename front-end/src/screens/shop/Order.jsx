import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'

import { Store } from '../../Store'
import LoadingBox from '../../components/LoadingBox'
import MessageBox from '../../components/MessageBox'
import Layout from '../../components/shop/Layout'
import { formatDate, getStripe } from '../../utils'

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: ''}
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: ''}
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload}
    case "PAY_REQUEST":
      return { ...state, loadingPay: true}
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true}
    case "PAY_FAIL":
      return { ...state, loadingPay: false}
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false}
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true}
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true}
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false}
    case "DELIVER_RESET":
      return { ...state, loadingDeliver: false, successDeliver: false}
    default:
      break;
  }
}

const Order = () => {
  const {id: orderId} = useParams()
  const {state} = useContext(Store)
  const {userInfo, cart: {cartItems, paymentMethod}} = state
  const navigate = useNavigate()
  const cookies = new Cookies()
  const [{loading, error, order, loadingPay, loadingDeliver, successPay, successDeliver}, dispatch] = useReducer(reducer, {loading: true, order: {}, error: '', successPay: false, loadingPay: false})
  const [{isPending}, paypalDispatch] = usePayPalScriptReducer()

  
  /* The above code is a React useEffect hook that fetches order data from the server and updates the
  state based on the result. It also checks if the user is logged in and redirects to the login page
  if not. If the order ID or payment/delivery success status changes, it refetches the data.
  Additionally, it loads the PayPal script and sets the options and loading status for PayPal
  payment processing. */
  useEffect(() => {
    const fetchData = async() => {
      try {
        dispatch({type: 'FETCH_REQUEST'})
        const {data} = await axios.get(`/api/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${cookies.get('aranoz-token')}`
          }
        }) 

        dispatch({type: 'FETCH_SUCCESS', payload: data})
      } catch (error) {
        console.log(error)
        dispatch({type: 'FETCH_FAIL', payload: error.message})
      }
    }

    if (!userInfo) {
      navigate('/login')
    }

    if (!order._id || successPay || successDeliver || (order._id && order._id !== orderId)) {
      fetchData()
      if (successPay) {
        dispatch({type: 'PAY_RESET'})
      }
      if (successDeliver) {
        dispatch({type: 'DELIVER_RESET'})
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get(`/api/keys/paypal`, {
          headers: {
            Authorization: `Bearer ${cookies.get('aranoz-token')}`
          }
        })
        paypalDispatch({
          type: 'resetOptions',
          value: {
            "client-id": clientId,
            currency: "USD",
          }
        })
        paypalDispatch({type: "setLoadingStatus", value: "pending"})
      }
      loadPaypalScript()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[order, userInfo, orderId, navigate, paypalDispatch, successPay, successDeliver])


  /**
   * This is an asynchronous function that sends a PUT request to deliver an order and updates the
   * state accordingly, while also displaying success or error messages.
   */
  const deliverOrder = async() => {
    try {
      dispatch({type: 'DELIVER_REQUEST'})
      await axios.put(`/api/order/${orderId}/deliver`, {} , {
        headers: { Authorization: `Bearer ${cookies.get('aranoz-token')}`}
      })
      toast.success(`Order is delivered`)
      dispatch({type: 'DELIVER_SUCCESS'})
    } catch (error) {
      console.log(error)
      dispatch({type: "DELIVER_FAIL"})
      toast.error('Order failed')
    }
  }



  /**
   * The function creates an order with a specified total price using the PayPal API.
   * returns The `createOrder` function is returning a promise that resolves to the `orderID` value.
   */
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {value: order.totalPrice}
        }
      ]
    })
    .then(orderID => orderID)
  }



  /**
   * This function captures payment details and sends a PUT request to update the order status, while
   * dispatching actions and displaying toast messages based on the success or failure of the request.
   * returns The `onApprove` function is returning a Promise that resolves to the result of calling
   * the `capture()` method on the `actions.order` object.
   */
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async details => {
      try {
        dispatch({type: 'PAY_REQUEST'})
          const {data} = await axios.put(`/api/order/${orderId}/pay`, details, {
            headers: { Authorization: `Bearer ${cookies.get('aranoz-token')}`}
          })

          console.log(data)
        dispatch({type: 'PAY_SUCCESS'})
        toast.success('Order is paid')
      } catch (error) {
        console.log(error)
        dispatch({type: 'PAY_FAIL'})
        toast.error('Order failed')
      }
    })
  }



  /**
   * The function `onError` displays an error message using the `toast` library.
   */
  const onError = (error) => {
    toast.error(error.message)
  }


  const orderWithStripe = async() => {
    const stripe = await getStripe()
    const {data} = await axios({
      url: `/api/stripe`,
      method: 'post',
      data: {
        cancelUrl: window.location.href,
        successUrl: window.location.origin,
        cart: cartItems
      },
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded',
        authorization: `Bearer ${cookies.get('aranoz-token')}`
      }
    })
    toast.loading('Redirecting...')
    stripe.redirectToCheckout({sessionId: data.id})
  }


  return (
    <Layout title={`Order ${orderId}`}>
      <Container className='order-screen'>
        {loading ? <LoadingBox/> : error ? <MessageBox variant="danger">{error}</MessageBox>: (
          <>
            <h3 className="my-3">Order {orderId}</h3>
            <Row>
              {/* LEFT content */}
              <Col md={8}>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title>Shipping</Card.Title>
                    <Card.Text className='mb-2'>
                      <strong>Name: </strong> {order.shippingAddress.fullName} <br />
                      <strong>Address: </strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country} {' '} {order.shippingAddress.location && order.shippingAddress.location.lat && (
                        <a target='new' href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}>Show on Map</a>
                      )}
                    </Card.Text>
                    {order.isDelivered ? <MessageBox variant="success">Delivered at {formatDate(order.deliveredAt)}</MessageBox> : <MessageBox variant="danger">Not Delivered</MessageBox>}
                  </Card.Body>
                </Card>

                <Card className='mb-3'>
                  <Card.Body>
                    <Card.Title>Payment</Card.Title>
                    <Card.Text className='mb-2'>
                      <strong>Method:</strong> {order.paymentMethod}
                    </Card.Text>
                    {order.isPaid ? <MessageBox variant="success">Paid at {order.paidAt}</MessageBox> : <MessageBox variant="danger">Not paid</MessageBox>}
                  </Card.Body>
                </Card>

                <Card className='mb-4'>
                  <Card.Body>
                    <Card.Title>Items</Card.Title>
                    <ListGroup variant='flush'>
                      {order.orderItems.map(item => (
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
                  </Card.Body>
                </Card>
              </Col>

              {/* RIGHT content */}
              <Col md={4}>
                <Card className='mb-3'>
                  <Card.Body>
                    <Card.Title className='text-center'>Order Summary</Card.Title>
                    <ListGroup variant='flush'>
                      <ListGroup.Item>
                        <Row>
                          <Col>Items</Col>
                          <Col>${order.itemsPrice.toFixed(2)}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Shipping</Col>
                          <Col>${order.shippingPrice.toFixed(2)}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Tax</Col>
                          <Col>${order.taxPrice.toFixed(2)}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col><strong>Order Total</strong></Col>
                          <Col><strong>${order.totalPrice.toFixed(2)}</strong></Col>
                        </Row>
                      </ListGroup.Item>
                      {!order.isPaid && (
                        paymentMethod === 'Paypal' ? (
                          <ListGroup.Item>
                          {isPending ? <LoadingBox/> : (
                            <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}
                            />
                          )}
                          {loadingPay && <LoadingBox/>}
                        </ListGroup.Item>
                        ) : (
                          <Button variant='dark' onClick={orderWithStripe}>Checkout</Button>
                        )
                      )}
                      {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <ListGroup.Item>
                          {loadingDeliver && <LoadingBox/>}
                          <div className='d-grid'>
                            <Button
                              variant='dark'
                              onClick={deliverOrder}
                            >
                              Deliver Order
                            </Button>
                          </div>
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </Layout>
  )
}

export default Order