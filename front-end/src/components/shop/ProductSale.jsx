import axios from "axios"
import { useEffect, useReducer } from "react"
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"

import Countdown from "../Countdown"
import LoadingBox from "../LoadingBox"
import MessageBox from "../MessageBox"

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return {...state, loading: true}
    case "FETCH_SUCCESS": 
      return {...state, loading: false, products: action.payload}
    case "FETCH_FAIL":
      return {...state, loading: false, error: action.payload}
    default:
      break;
  }
}

const ProductSale = () => {
  const [{loading, products, error}, dispatch] = useReducer(reducer, {loading: true, products: [], error: ''})
  const product = products[Math.floor(Math.random() * products.length)]
  const targetDate = '2023-06-31T00:00:00'

  useEffect(() => {
    const fetchData = async() => {
      dispatch({type: 'FETCH_REQUEST'})
      try {
        const {data} = await axios.get('/api/product')
        dispatch({type: 'FETCH_SUCCESS', payload: data})
      } catch (error) {
        console.log(error)
        dispatch({type: 'FETCH_FAIL', payload: error.message})
      }
    }

    fetchData()
  },[])


  return (
    <section className="product-sale">
      <Container className="justify-content-between">
        {loading ? <LoadingBox/> : error ? <MessageBox variant='danger'>{error}</MessageBox>: (
          <>
            <img src={product.image.secure_url} alt="" />
            <div className="content-sale">
              <h2>Monthly Sale on 60% Off All Products</h2>
              <Countdown date={targetDate}/>
              
              <Link to="/search">buy now</Link>
            </div>
          </>
        )}
      </Container>
    </section>
  )
}

export default ProductSale