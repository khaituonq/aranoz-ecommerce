import axios from 'axios'
import { useEffect, useReducer } from 'react'
import { Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'
import { MdViewSidebar } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'

import LoadingBox from '../../components/LoadingBox'
import MessageBox from '../../components/MessageBox'
import Pagination from '../../components/Pagination'
import DashBoardLayout from '../../components/dashboard/DashBoardLayout'
import { formatDate } from '../../utils'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true}
    case 'FETCH_SUCCESS':
      return {
        ...state, 
        loading: false, 
        orders: action.payload.orders,
        page: action.payload.page,
        pages: action.payload.pages
      }
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload}
    case 'DELETE_REQUEST':
      return {...state, loadingDelete: true, successDelete: false}
    case 'DELETE_SUCCESS':
      return {...state, loadingDelete: false, successDelete: true}
    case 'DELETE_FAIL':
      return {...state, loadingDelete: false}
    case 'DELETE_RESET':
      return {...state, loadingDelete: false, successDelete: false}  
    default:
      break;
  }
}

const DashboardOrderList = () => {
  const [{loading, orders, pages, loadingDelete, successDelete, error}, dispatch] = useReducer(reducer, {loading: true, error: ''})
  const cookies = new Cookies()
  const navigate = useNavigate()
  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const page = sp.get('page') || 1



  /* The `useEffect` hook is used to fetch the list of orders from the server and update the state of the
  component. It runs after the component is mounted and whenever the `successDelete` state changes. */
  useEffect(() => {
    const fetchData = async() => {
      dispatch({type: 'FETCH_REQUEST'})
      try {
        const {data} = await axios.get(`/api/order`,{
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
    if (successDelete) {
      dispatch({type: 'DELETE_RESET'})
    } else {
      fetchData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[successDelete])



  /**
   * This function handles the deletion of an order and displays a confirmation message before deleting
   * it.
   */
  const deleteHandler = async(order) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({type: 'DELETE_REQUEST'})
        await axios.delete(`/api/order/${order._id}`,{
          headers: {
            authorization: `Bearer ${cookies.get('aranoz-token')}`
          }
        })
        dispatch({type: 'DELETE_SUCCESS'})
      } catch (error) {
        console.log(error)
        toast.error('Delete order failed')
        dispatch({type: 'DELETE_FAIL'})
      }
    }
  }



  return (
    <DashBoardLayout title='Order Dashboard'>

      <div className="d-flex align-items-center result-page">
        <h5>{orders?.length} result (page {page}/{pages})</h5>
      </div>

      {loadingDelete && <loadingDelete/>}
      {loading ? <LoadingBox/> : error ? <MessageBox variant='danger'>{error}</MessageBox> : (
        <>
          {orders.length > 0 ? 
            <div className='table-responsive'>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>USER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th colSpan={2}></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td valign='middle'>{order._id}</td>
                      <td valign='middle'>{order.user ? order.user.name : 'DELETE USER'}</td>
                      <td valign='middle'>{formatDate(order.createdAt)}</td>
                      <td valign='middle'>{order.totalPrice.toFixed(2)}</td>
                      <td valign='middle'>{order.isPaid ? formatDate(order.paidAt) : 'No'}</td>
                      <td valign='middle'>{order.isDelivered ? formatDate(order.deliveredAt) : 'no'}</td>
                      <td valign='middle' align='center' className='d-flex justify-content-center gap-1'>
                        <OverlayTrigger
                          placement='left'
                          overlay={
                            <Tooltip>
                              View details
                            </Tooltip>
                          }
                        >
                          <Button
                            variant='primary'
                            onClick={() => navigate(`/order/${order._id}`)}
                          >
                            <MdViewSidebar/>
                          </Button>
                        </OverlayTrigger>
                        &nbsp;
                        <OverlayTrigger
                          placement='right'
                          overlay={
                            <Tooltip>
                              Delete order
                            </Tooltip>
                          }
                        >
                          <Button
                            disabled={loadingDelete}
                            variant="danger"
                            onClick={() => deleteHandler(order)}
                          >
                            <FaTrash/>
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          : <div className='no-product'>No orders</div>}
          <Pagination pages={pages} page={page} url='/dashboard/orders'/>
        </>
      )}

    </DashBoardLayout>
  )
}

export default DashboardOrderList