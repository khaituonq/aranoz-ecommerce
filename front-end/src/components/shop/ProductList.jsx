import axios from 'axios'
import { Col, Container, Row } from "react-bootstrap"

import { useEffect, useReducer } from "react"
import LoadingBox from '../LoadingBox'
import MessageBox from '../MessageBox'
import Card from "./Card"

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true }
    case "FETCH_SUCCESS": 
      return { ...state, products: action.payload, loading: false}
    case "FETCH_FAIL": 
      return { ...state, loading: false, error: action.payload}
  
    default:
      break;
  }
}

const ProductList = () => {
  const [{products, loading, error}, dispatch] = useReducer(reducer, {product: [], loading: true, error: ''})

  useEffect(() => {
    const fetchProducts = async() => {
      dispatch({type: 'FETCH_REQUEST'})
      try {
        const result = await axios({
          url: '/api/product',
          method: 'get'
        })
        dispatch({type: 'FETCH_SUCCESS', payload: result.data})
      } catch (error) {
        dispatch({type: 'FETCH_FAIL', payload: error.message})
      }
    }
    fetchProducts()
  },[])


  return (
    <Container className='main'>
      <h2>Awesome</h2>
        {loading ? <LoadingBox height="30vh"/> : error ? <MessageBox variant="danger">{error}</MessageBox>: (
          <Row>
            {products.map((product, index) => (
              <Col key={index} lg={4} md={6}>
                <Card product={product}/>
              </Col>
            ))}
          </Row>
        )}
    </Container>
  )
}

export default ProductList