import axios from 'axios'
import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { Button, Col, Container, FloatingLabel, Form, ListGroup, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'

import { Store } from '../../Store'
import LoadingBox from '../../components/LoadingBox'
import MessageBox from '../../components/MessageBox'
import Layout from '../../components/shop/Layout'
import Rating from '../../components/shop/Rating'
import { formatDate } from '../../utils'

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload}
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true}
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false}
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false}
    case "FETCH_REQUEST":
      return { ...state, loading: true}
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload}
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload}
      
    default:
      break;
  }
}


const Product = () => {
  const [{loading, product, error, loadingCreateReview}, dispatch] = useReducer(reducer, {loading: true, product: {}, error: ''})
  const { slug } = useParams()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { cart, userInfo } = state
  const cookies = new Cookies()
  const reviewsRef = useRef()


  
  /* `useEffect` is a React hook that is used to perform side effects in functional components. In this
  code snippet, `useEffect` is being used to fetch a product from the server using the `slug`
  parameter from the URL. */
  useEffect(() => {
    const fetchProduct = async () => {
      dispatch({type: 'FETCH_REQUEST'})
      try {
        const result = await axios({
          url: `/api/product/slug/${slug}`,
          method: 'get'
        })

        dispatch({type: 'FETCH_SUCCESS', payload: result.data})
      } catch (error) {
        console.log(error)
        dispatch({type: 'FETCH_FAIL', payload: error.message})
      }
    }

    fetchProduct()
  }, [slug])



  /**
   * This function creates a review for a product and sends it to the server.
   * returns Nothing is being returned explicitly in this code snippet. However, the function may
   * return early if the `if` condition is met and a toast message is displayed.
   */
  const createReview = async(e) => {
    e.preventDefault()
    if (!comment || !rating) {
      toast.warn("Please enter comment and rating")
      return
    }
    try {
      const { data } = await axios({
        url: `/api/product/${product._id}/reviews`,
        method: 'post',
        data: {
          rating, comment, name: userInfo.name
        },
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${cookies.get('aranoz-token')}`
        }
      })

      dispatch({type: 'CREATE_SUCCESS'})
      toast.success('Review submitted successfully')
      product.reviews.unshift(data?.review)
      product.numReviews = data?.numReviews
      product.rating = data?.rating
      dispatch({type: 'REFRESH_PRODUCT', payload: product})
      setRating(0)
      setComment('')
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop
      })
    } catch (error) {
      toast.error(error?.response.data.message)
      dispatch({type: 'CREATE_FAIL', payload: error.message})
    }
  }



  /**
   * This function adds a product to the cart and checks if it is in stock before doing so.
   * returns The function `addCart` is not returning anything explicitly. It is dispatching an action
   * to add an item to the cart and navigating to the cart page.
   */
  const addCart = async() => {
    const existItem = cart.cartItems.find(x => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/product/${product._id}`)
    if (data.countInStock < quantity) {
      return toast.warn("Sorry. Product is out of stock")
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: {...product, quantity}
    })
    navigate('/cart')
  }


  return (
    <Layout title='Product'>
      <Container className='product-screen'>
        {
          loading ? (
            <LoadingBox/>
          ) : error ? <MessageBox variant="danger">{error}</MessageBox>:
          (
            <>
              {/* PRODUCT area */}
              <Row>
                {/* LEFT content */}
                <Col lg={8} className='d-flex flex-wrap gap-2 left'>
                  <img className='image' src={product.image?.secure_url} alt="" />
                  {product.images?.map((image, index) => (
                    <img className='images' key={index} src={image.secure_url} alt={image.public_id.split('/')[1]}/>
                  ))}
                </Col>
                {/* RIGHT content */}
                <Col lg={4} className='right'>
                  <h3>{product.name}</h3>
                  <div className="d-flex align-items-center justify-content-between">
                    <h5>Brand: <strong>{product.brand}</strong></h5>
                    <h5>Count in stock: <strong>{product.countInStock}</strong></h5>
                  </div>
                  <h6>${product.price}</h6>
                  <button onClick={addCart} className='add-cart'>Add to Bag</button>
                  {/* <button className='add-favourite'><span>Favourite</span><AiOutlineHeart/></button> */}
                  <p>{product.description}</p>
                </Col>
              </Row>
              

              {/* REVIEW area */}
              <Row>
                <Col lg={6} className='review-area'>
                  <div className='my-3'>
                    <h2 ref={reviewsRef}>Reviews</h2>
                    <div className='mb-3'>
                      {product.reviews.length === 0 && <MessageBox>There is no review</MessageBox>}
                    </div>
                    <ListGroup>
                      {product.reviews?.map(review => (
                        <ListGroup.Item key={review._id}>
                          <strong>{review.name}</strong>
                          <Rating rating={review.rating} caption=""/>
                          <p>{formatDate(review.createdAt)}</p>
                          <p>{review.comment}</p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                  
                  <div className='my-3'>
                    {userInfo ? (
                      <form onSubmit={createReview}>
                        <h2>Write a customer review</h2>
                        <Form.Group className="mb-3" controlId="rating">
                          <Form.Label>Rating</Form.Label>
                          <Form.Select
                            aria-label="Rating"
                            value={rating}
                            onChange={e => setRating(e.target.value)}
                          >
                            <option value="">Select...</option>
                            <option value="1">1- Poor</option>
                            <option value="2">2- Fair</option>
                            <option value="3">3- Good</option>
                            <option value="4">4- Very good</option>
                            <option value="5">5- Excelent</option>
                          </Form.Select>
                        </Form.Group>
                        <FloatingLabel
                          controlId='floatingTextarea'
                          label="Comments"
                          className='mb-3'
                        >
                          <Form.Control
                            as="textarea"
                            placeholder='Please enter a comment here'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        </FloatingLabel>
                  
                        <div className='mb-3 d-flex justify-content-end'>
                          <Button disabled={loadingCreateReview} variant='dark' type='submit'>Create</Button>
                          {loadingCreateReview && <LoadingBox/>}
                        </div>
                      </form>
                    ): (
                      <MessageBox>
                        Please{" "}
                        <Link to={`/auth?redirect=/product/${product.slug}`}>Sign In</Link>
                        {" "}
                        to write a review
                      </MessageBox>
                    )}
                  </div>
                </Col>
              </Row>
            </>
          )
        }
      </Container>
    </Layout>
  )
}

export default Product