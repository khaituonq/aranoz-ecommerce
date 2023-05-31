import { useContext, useEffect, useReducer } from 'react'
import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { HiPlus } from 'react-icons/hi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'

import axios from 'axios'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { Store } from '../../Store'
import LoadingBox from '../../components/LoadingBox'
import Pagination from '../../components/Pagination'
import DashBoardLayout from '../../components/dashboard/DashBoardLayout'
import Switch from '../../components/dashboard/Switch'
import { formatDate } from '../../utils'
import MessageBox from '../../components/MessageBox'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true}
    case 'FETCH_SUCCESS': 
      return {
        ...state,
        products: action.payload.product,
        page: action.payload.page,
        pages: action.payload.pages,
        productCount: action.payload.countProducts,
        loading: false
      }
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload}
    case "DELETE_REQUEST":
      return {...state, loadingDelete: true, successDelete: false}
    case "DELETE_SUCCESS": 
      return {...state, loadingDelete: false, successDelete: true}
    case "DELETE_FAIL":
      return {...state, loadingDelete: false, successDelete: false}
    case "DELETE_RESET": 
      return {...state, loadingDelete: false, successDelete: false}
    case "UPDATE_STATUS_REQUEST": 
      return {...state, successUpdateStatus: false}
    case "UPDATE_STATUS_SUCCESS":
      return {...state, successUpdateStatus: true}
    case "UPDATE_STATUS_FAIL":
      return {...state, successUpdateStatus: false, error: action.payload}

    default: 
      return state
  }
}

const DashboardProduct = () => {
  const [
    {
      productCount,
      loading, 
      error,
      products, 
      pages, 
      successUpdateStatus,
      successDelete
    }, dispatch] = useReducer(reducer, {loading: true, error: ''})
  const { state } = useContext(Store)
  const { userInfo } = state
  const cookies = new Cookies()
  const navigate = useNavigate()
  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const page = sp.get('page') || 1


 /* The `useEffect` hook is used to fetch data from the server and update the state of the component.
 It runs after the component is mounted and whenever any of the dependencies (`page`, `userInfo`,
 `successDelete`, `successUpdateStatus`) change. */
  useEffect(() => { 
    const fetchData = async () => {
      try {
        dispatch({type: "FETCH_REQUEST"})
        const { data } = await axios({
          url: `/api/product/admin`,
          params: {page},
          method: 'get',
          headers: {
            authorization: `Bearer ${cookies.get('aranoz-token')}`
          }
        })
        dispatch({type: 'FETCH_SUCCESS', payload: data})
      } catch (error) {
        dispatch({type: 'FETCH_FAIL', payload: error})
        console.log(error)
      }
    }

    if (successDelete) {
      dispatch({type: "DELETE_RESET"})
    } else {
      fetchData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[page, userInfo, successDelete, successUpdateStatus])



 /**
  * This function adds a new product by sending a post request to the server and navigating to the
  * newly created product's page.
  */
  const addProduct = async() => {
    if (window.confirm('Are you sure to create?')) {
      try {
        const { data } = await axios({
          url: '/api/product',
          method: 'post',
          data: {},
          headers: {
            "Content-Type" : "application/x-www-form-urlencoded",
            authorization: `Bearer ${cookies.get('aranoz-token')}`
          }
        })
        navigate(`/dashboard/product/${data.product._id}?type=create`)
      } catch (error) {
        console.log(error)
        toast.error('Create product failed')
      }
    }
  }



  /**
   * This function deletes a product with a given ID and displays a confirmation message before
   * deleting.
   */
  const deleteProduct = async(id) => {
    if (window.confirm('Are you sure to delete')) {
      dispatch({type: "DELETE_REQUEST"})
      try {
        await axios({
          url: `/api/product/${id}`,
          method: 'delete',
          headers: {
            authorization: `Bearer ${cookies.get('aranoz-token')}`
          }
        })
        dispatch({type: 'DELETE_SUCCESS'})
        toast.success("Deleted product successfully")
      } catch (error) {
        dispatch({type: 'DELETE_FAIL'})
        console.log(error)
        toast.error("Delete failed")
      }
    }
  }


  
  /**
   * This is an asynchronous function that updates the status of a product and dispatches actions based
   * on the success or failure of the update.
   */
  const updateStatus = async(id, valueChecked, dispatch) => {
    try {
      dispatch({type: "UPDATE_STATUS_REQUEST"})
      await axios({
        url: `/api/product/update-status/${id}`,
        method: 'patch',
        data: {status: !valueChecked},
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          authorization: `Bearer ${cookies.get('aranoz-token')}`
        }
      })
      dispatch({type: "UPDATE_STATUS_SUCCESS"})
      toast.success("Update status successfully")
    } catch (error) {
      console.log(error)
      dispatch({type: "UPDATE_STATUS_FAIL"})
      toast.error('Update status failed')
    }
  }

  return (
    <DashBoardLayout title="Product Dashboard">

      {/* Search FORM */}

      <div className="d-flex align-items-center justify-content-between result-page">
        <h5>{productCount} result (page {page}/{pages})</h5>
        <button onClick={addProduct} className='d-flex gap-2 align-items-center'><span>Add</span><HiPlus/></button>
      </div>

      {loading ? (
        <LoadingBox/>
      ): error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ): (
        <>
          {products.length > 0 ? (
          <div className='table-responsive'>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className='w-10'></th>
                  <th>Status</th>
                  <th>Banner</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Images</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Stocks</th>
                  <th>Rating</th>
                  <th>Reviews</th>
                  <th>Create At</th>
                  <th>Update At</th>
                  <th colSpan={2}></th>
                </tr>
              </thead>

              <tbody>
                {products?.map((product, index) => (
                  <tr key={index} >
                    <th valign='middle'>{index + 1}</th>
                    <td align='center' valign='middle'>
                      <Switch 
                        id={product._id} 
                        valueChecked={product.useOrNot} 
                        dispatch={dispatch} 
                        updateStatus={updateStatus}
                        tooltipContent='Active product'
                      />
                    </td>
                    <td valign='middle'>{product.bannerUsage ? 'Yes' : 'No'}</td>
                    <td valign='middle' className='name'>{product.name}</td>
                    <td valign='middle' className='image'>
                      <img src={product.image.secure_url} alt="" />
                    </td>
                    <td valign='middle' className='images'>
                      {product.images?.map((image, index) => (
                        <img key={index} src={image.secure_url} alt={image.public_id}/>
                      ))}
                    </td>
                    <td valign='middle'>{product.category}</td>
                    <td valign='middle'>{product.description}</td>
                    <td valign='middle'>{product.countInStock}</td>
                    <td valign='middle'>{product.rating}</td>
                    <td valign='middle'>{product.numReviews}</td>
                    <td valign='middle' className='date'>{formatDate(product.createdAt)}</td>
                    <td valign='middle' className='date'>{formatDate(product.updatedAt)}</td>
                    <td valign='middle' className='btn-actions'>
                      <OverlayTrigger
                        placement='left'
                        overlay={
                          <Tooltip>
                            Edit product
                          </Tooltip>
                        }
                      >
                        <Link to={`/dashboard/product/${product._id}?type=edit`} className='btn btn-primary'><FaEdit/></Link>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement='top'
                        overlay={
                          <Tooltip>
                            Delete product
                          </Tooltip>
                        }
                      >
                        <Button onClick={() => deleteProduct(product._id)} variant='danger'><FaTrash/></Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          ): <div className='no-product'>No product</div>}
          <Pagination pages={pages} page={page} url='/dashboard/products'/>
        </>
      )}

      

    </DashBoardLayout>
  )
}

export default DashboardProduct