import axios from 'axios'
import { useEffect, useReducer, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import LoadingBox from '../../components/LoadingBox'
import MessageBox from '../../components/MessageBox'
import Pagination from '../../components/Pagination'
import Card from '../../components/shop/Card'
import Layout from '../../components/shop/Layout'
import Rating from '../../components/shop/Rating'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true}
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false, 
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
      }
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload}
    default:
      break;
  }
}

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];

const ratings = [
  {
    name: "5starts",
    rating: 5
  },

  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2stars & up",
    rating: 2,
  },

  {
    name: "1stars & up",
    rating: 1,
  },
];

const Search = () => {
  const [{loading, products, pages, countProducts, error}, dispatch] = useReducer(reducer, {loading: true, error: ''})
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()
  const {search} = useLocation()
  const sp = new URLSearchParams(search)
  const category = sp.get('category') || 'all'
  const query = sp.get('query') || 'all'
  const price = sp.get('price') || 'all'
  const rating = sp.get('rating') || 'all'
  const order = sp.get('order') || 'newest'
  const page = sp.get('page') || 1



  /* The `useEffect` hook is used to fetch products from the server based on the search filters and
  update the state of the component with the fetched data. It runs whenever any of the dependencies
  in the dependency array `[page, query, category, price, rating, order, error]` change. The effect
  function calls an asynchronous function `fetchData` that sends a GET request to the server to
  retrieve the products based on the search filters. If the request is successful, the function
  updates the state of the component with the fetched data using the `dispatch` function and the
  `FETCH_SUCCESS` action type. If the request fails, the function logs the error to the console and
  updates the state of the component with the error message using the `dispatch` function and the
  `FETCH_FAIL` action type. */
  useEffect(() => {
    const fetchData = async() => {
      dispatch({type: 'FETCH_REQUEST'})
      try {
        const {data} = await axios.get(`/api/product/search`,{
          params: {
            page,
            query,
            category,
            price,
            rating,
            order
          }
        })
        dispatch({type: 'FETCH_SUCCESS', payload: data})
      } catch (error) {
        console.log(error)
        dispatch({type: 'FETCH_FAIL', payload: error.message})
      }
    }

    fetchData()
  },[page, query, category, price, rating, order, error])



  /* The `useEffect` hook is used to fetch the categories of products from the server and update the
  state of the component with the fetched data. It runs only once when the component mounts, because
  the dependency array `[dispatch]` is empty. If the `dispatch` function changes, the effect will
  run again. The effect function calls an asynchronous function `fetchCategories` that sends a GET
  request to the server to retrieve the categories of products. If the request is successful, the
  function updates the state of the component with the fetched data using the `setCategories`
  function. If the request fails, the function logs the error to the console and displays an error
  message using the `toast` function from the `react-toastify` library. */
  useEffect(() => {
    const fetchCategories = async() => {
      try {
        const {data} = await axios.get(`/api/product/categories`)
        setCategories(data)
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
    fetchCategories()
  },[dispatch])



  /**
   * The function takes a filter object and returns a URL string with the filter parameters.
   * returns The function `getFilterUrl` returns a string that represents a URL with query parameters
   * based on the provided `filter` object. The URL includes the values of `filterCategory`,
   * `filterQuery`, `filterPrice`, `filterRating`, `filterOrder`, and `filterPage` as query parameters.
   */
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page
    const filterCategory = filter.category || category
    const filterQuery = filter.query || query
    const filterRating = filter.rating || rating
    const filterPrice = filter.price || price
    const filterOrder = filter.order || order
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}&page=${filterPage}`
  }


  return (
    <Layout title="Search Products">
      <Container className='search-screen'>
        <Row>
          {/* LEFT content */}
          <Col md={3}>
            {/* Categories filter */}
            <div className='mb-3'>
              <h3>Categories</h3>
              <ul>
                <li>
                  <Link 
                    className={category === 'all' ? 'text-bold' : ''}
                    to={getFilterUrl({category: 'all'})}
                  >Any</Link>
                </li>
                {categories.map((c, index) => (
                  <li key={index}
                  >
                    <Link
                      className={c === 'category' ? 'text-bold' : ''}
                      to={getFilterUrl({category: c})}
                    >{c}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <hr className='w-75'/>      
        
            {/* Prices filter */}
            <div className='mb-3'>
              <h3>Price</h3>
              <ul>
                <li>
                  <Link 
                    className={price === 'all' ? 'text-bold' : ''}
                    to={getFilterUrl({price: 'all'})}
                  >Any</Link>
                </li>
                {prices.map((p, index) => (
                  <li key={index}
                  >
                    <Link
                      className={p.value === price ? 'text-bold' : ''}
                      to={getFilterUrl({price: p.value})}
                    >{p.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <hr className='w-75'/>  
        
            {/* Reviews filter  */}
            <div className='mb-3'>
              <h3>Customer Review</h3>
              <ul>
                {ratings.map((r, index) => (
                  <li key={index}
                  >
                    <Link
                      className={r.rating === rating ? 'text-bold' : ''}
                      to={getFilterUrl({rating: r.rating})}
                      >
                      <Rating caption={" & up"} rating={r.rating}/>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    className={rating === 'all' ? 'text-bold' : ''}
                    to={getFilterUrl({rating: 'all'})}
                  >
                    <Rating caption={" & up"} rating={0}/>
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
        
          {/* RIGHT content */}
          <Col md={9}>
            {loading ? <LoadingBox/> : error ? <MessageBox variant='danger'>{error}</MessageBox> : (
              <>
                {/* Search results */}
                <Row className='justify-content-between mb-3'>
                  <Col md={6} xs={12} className='mb-3'>
                    {countProducts === 0 ? 'No' : <strong>{countProducts}</strong>} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : ' + price}
                    {rating !== 'all' && ' : ' + rating} {' '}
                    {query !== 'all' || category !== 'all' || rating !== 'all' || price !== 'all' ? (
                      <Button
                        variant='light'
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </Col>

                  <Col md={6} xs={12} className='text-end d-flex justify-content-md-end justify-content-xs-start align-items-center gap-3'>
                    Sort by{" "}
                    <Form.Select
                      value={order}
                      onChange={(e) => navigate(getFilterUrl({order: e.target.value}))}
                      className='w-50'
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="lowest">Price: Low to High</option>
                      <option value="highest">Price: High to Low</option>
                      <option value="toprated">Avg. Customer Reviews</option>
                    </Form.Select>
                  </Col>
                </Row>

                {/* Product items */}
                <Row>
                  {products.length === 0 ? 
                  <MessageBox variant="dark">No product found</MessageBox> :
                  products.map(product => (
                    <Col lg={4} sm={6} key={product._id}>
                      <Card product={product}/>
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                <Pagination pages={pages} page={page} url='/search' identify='shop'/>
              </>  
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export default Search