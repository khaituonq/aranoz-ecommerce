import axios from 'axios'
import { useEffect, useReducer } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import Chart from 'react-google-charts'
import Cookies from 'universal-cookie'

import LoadingBox from '../../components/LoadingBox'
import MessageBox from '../../components/MessageBox'
import DashBoardLayout from '../../components/dashboard/DashBoardLayout'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true}
    case 'FETCH_SUCCESS':
      return {...state, loading: false, summary: action.payload}
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload}
    default:
      break;
  }
}

const Dashboard = () => {
  const [{summary, loading, error}, dispatch] = useReducer(reducer, {loading: true, error: '', summary: {}})
  const cookies = new Cookies()



  /* `useEffect` is a hook in React that allows us to perform side effects in functional components. In
  this code, `useEffect` is used to fetch data from the server when the component mounts. It takes a
  function as its first argument, which is executed after the component is mounted. The second
  argument is an array of dependencies, which determines when the effect should be re-run. In this
  case, the empty array `[]` means that the effect should only run once, when the component mounts. */
  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: 'FETCH_REQUEST'})
      try {
        const {data} = await axios.get(`/api/order/summary`,{
          headers: {
            authorization: `Bearer ${cookies.get('aranoz-token')}` 
          }
        })

        dispatch({type: 'FETCH_SUCCESS', payload: data})
      } catch (error) {
        console.log(error)
        dispatch({type: 'FETCH_FAIL', payload: error.message})
      }
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  
  return (
    <DashBoardLayout title='Dashboard'>
      {loading ? <LoadingBox/> : error ? <MessageBox variant='danger'>{error}</MessageBox> : (
        <>
          {/* DETAIL summary */}
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.users && summary.users[0] ? summary.users[0].numUsers : 0}
                  </Card.Title>
                  <Card.Text>Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.orders && summary.users[0] ? summary.orders[0].numOrders : 0}
                  </Card.Title>
                  <Card.Text>Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.orders && summary.users[0] ? summary.orders[0].totalSales.toFixed(2) : 0}
                  </Card.Title>
                  <Card.Text>Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* DETAIL charts */}
          <div className='my-3'>
            <h2>Sale</h2>
            {summary.dailyOrders.length === 0 ? <MessageBox>No Sale</MessageBox> : 
              <Chart
                width="100%"
                height='400px'
                chartType='AreaChart'
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales'],
                  ...summary.dailyOrders.map(x => [x._id, x.sales])
                ]}
              />
            }
          </div>

          <div className='my-3'>
            <h2>Categories</h2>
            {summary.productCategories.length === 0 ? <MessageBox>No Categories</MessageBox> : 
              <Chart
                width="100%"
                height='400px'
                chartType='PieChart'
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map(x => [x._id, x.count])
                ]}
              />
            }
          </div>
        </>
      )}
    </DashBoardLayout>
  )
}

export default Dashboard