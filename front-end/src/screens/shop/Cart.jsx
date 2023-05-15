import axios from 'axios'
import { useContext } from 'react'
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Store } from '../../Store'
import MessageBox from '../../components/MessageBox'
import Layout from '../../components/shop/Layout'

const Cart = () => {
  const navigate = useNavigate()
  const {state, dispatch } = useContext(Store)
  const { cart: {cartItems} } = state



  /**
   * The function updates the cart by adding an item with a specified quantity, after checking if the
   * item is in stock.
   * returns If the `countInStock` of the `item` is less than the `quantity`, a warning message
   * "Sorry. Product is out of stock" will be returned using the `toast.warn()` method. Otherwise, the
   * `CART_ADD_ITEM` action is dispatched with the payload of an object containing the `item` and its
   * `quantity`.
   */
  const updateCart = async(item, quantity) => {
    const { data } = await axios.get(`/api/product/${item._id}`)
    if (data.countInStock < quantity) {
      return toast.warn("Sorry. Product is out of stock")
    }
    dispatch({type: "CART_ADD_ITEM", payload: {...item, quantity}})
  }



  /**
   * This function dispatches an action to remove an item from the cart.
   */
  const removeItem = (item) => {
    dispatch({type: "CART_REMOVE_ITEM", payload: item})
  }



 /**
  * The `checkout` function navigates the user to the authentication page with a redirect to the
  * shipping page.
  */
  const checkout = () => {
    navigate(`/auth?redirect=/shipping`)
  }


  return (
    <Layout title="Shopping Cart">
      <Container className='cart-screen'>
        <h4 className='title'>Shopping Cart</h4>
        <Row>
          {/* LEFT content */}
          <Col md={8} className='left'>
            {cartItems.length === 0 ? <MessageBox>Cart is empty. <Link className='home-page' to="/">Go Shopping</Link></MessageBox> :(
              <ListGroup>
                {cartItems?.map(item => (
                  <ListGroup.Item key={item._id}>
                    <Row className='align-items-center'>
                      <Col md={5} className='d-flex gap-2 align-items-center image'>
                        <img src={item.image.secure_url} alt={item.name} className='img-fluid rounded img-thumbnail'/>{""}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3} xs={4} className='d-flex gap-2 align-items-center justify-content-center'>
                        <Button variant='light' disabled={item.quantity === 1} onClick={() => updateCart(item, item.quantity - 1)}><i className="fas fa-minus-circle"></i></Button>
                        <span>{item.quantity}</span>{" "}
                        <Button variant='light' disabled={item.quantity === item.countInStock} onClick={() => updateCart(item, item.quantity + 1)}><i className="fas fa-plus-circle"></i></Button>
                      </Col>
                      <Col md={2} xs={4} className='d-flex justify-content-center'>${item.price}</Col>
                      <Col md={2} xs={4} className='d-flex justify-content-center'>
                        <Button variant='danger' onClick={() => removeItem(item)}>
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>

          {/* RIGHT content */}
          <Col md={4}>
            <Card>
              <Card.Body>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h4>
                      Subtotal
                    </h4>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Item: {cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Price: ${cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className='d-grid'>
                      <Button
                        variant='dark'
                        disabled={cartItems.length === 0}
                        onClick={checkout}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
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

export default Cart