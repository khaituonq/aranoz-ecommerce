import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'

import { Store } from '../../Store'
import LoadingBox from '../../components/LoadingBox'
import Pagination from '../../components/Pagination'
import DashBoardLayout from '../../components/dashboard/DashBoardLayout'
import Switch from '../../components/dashboard/Switch'
import { formatDate } from '../../utils'
import MessageBox from '../../components/MessageBox'

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return {...state, loading: true}
    case "FETCH_SUCCESS":
      return {...state,
        users: action.payload.users,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false} 
    case "FETCH_FAIL":
      return {...state, loading: false, error: action.payload}
    case "DELETE_REQUEST":
      return {...state, loadingDelete: true, successDelete: false}
    case "DELETE_SUCCESS": 
      return {...state, loadingDelete: false, successDelete: true}
    case "DELETE_FAIL":
      return {...state, loadingDelete: false}
    case "DELETE_RESET":
      return {...state, loadingDelete: false, successDelete: false}
    case "UPDATE_ADMIN_REQUEST":
      return {...state, loadingUpdateAdmin: false}
    case "UPDATE_ADMIN_SUCCESS":
      return {...state, loadingUpdateAdmin: true}
    case "UPDATE_ADMIN_FAIL": 
      return {...state, loadingUpdateAdmin: false}

    default:
      return state
  }
}

const DashBoardUserList = () => {
  const [{loading, error, users, page, pages, successDelete, loadingUpdateAdmin}, dispatch] = useReducer(reducer, {loading: true, error: ''})
  const { state } = useContext(Store)
  const { userInfo } = state
  const cookies = new Cookies()



  /* The `useEffect` hook is used to fetch data from the server and update the state of the component.
  It runs after the component is mounted and whenever the dependencies (`userInfo`, `successDelete`,
  and `loadingUpdateAdmin`) change. */
  useEffect(() => {
    const fetchData = async() => {
      try {
        dispatch({type: "FETCH_REQUEST"})
          const { data } = await axios({
            url: `/api/user`,
            method: 'get',
            headers: {
              Authorization: `Bearer ${cookies.get('aranoz-token')}`
            }
          })

        dispatch({type: "FETCH_SUCCESS", payload: data})
      } catch (err)  {
        dispatch({type: "FETCH_FAIL", payload: err})
      }
    }

    if (successDelete) {
      dispatch({type: 'DELETE_RESET'})
    } else {
      fetchData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userInfo, successDelete, loadingUpdateAdmin])



  /**
   * This function updates the admin status of a user in the database and dispatches actions based on
   * the success or failure of the update.
   */
  const updateAdmin = async(id, valueChecked, dispatch) => {
    console.log(id, valueChecked, dispatch)
    try {
      dispatch({type: "UPDATE_ADMIN_REQUEST"})
      await axios({
        url: `/api/user/update-admin/${id}`,
        method: "patch",
        data: {status: !valueChecked},
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          authorization: `Bearer ${cookies.get('aranoz-token')}`
        }
      })

      dispatch({type: "UPDATE_ADMIN_SUCCESS"})
      toast.success("Update status successfully")
    } catch (error) {
      console.log(error)
      dispatch({type: "UPDATE_ADMIN_FAILED"})
      toast.error("Update failed")
    }
  }



  /**
   * This function deletes a user with a given ID after confirming with the user and handling success
   * and failure cases.
   */
  const deleteUser = async(id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        dispatch({type: "DELETE_REQUEST"})
        await axios({
          url: `/api/user/${id}`,
          method: 'delete',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            authorization: `Bearer ${cookies.get('aranoz-token')}`
          }
        })
        dispatch({type: "DELETE_SUCCESS"})
        toast.success("Delete user successfully")
      } catch (error) {
        console.log(error)
        dispatch({type: "DELETE_FAIL"})
        toast.error("Delete failed")
      }
    }
  }


  
  return (
    <DashBoardLayout title="User DashBoard">
      <div className="d-flex align-items-center justify-content-between result-page">
        <h5>{users?.length} result (page {page}/{pages})</h5>
      </div>

      {loading ? (
        <LoadingBox/>
      ): error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ): (
        <div>
          {users.length > 0 ? (
            <div className='table-responsive'>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className='w-10'></th>
                  <th>Name</th>
                  <th>Admin</th>
                  <th>Email</th>
                  <th>Create At</th>
                  <th>Update At</th>
                  <th colSpan={2}></th>
                </tr>
              </thead>

              <tbody>
                {users?.map((user, index) => (
                  <tr key={index}>
                    <th align='center' valign='middle'>{index + 1}</th>
                    <td valign='middle' className='name'>{user.name}</td>
                    <td align='center' valign='middle'>
                      <Switch 
                        id={user._id} 
                        valueChecked={user.isAdmin} 
                        dispatch={dispatch} 
                        updateStatus={updateAdmin}
                        tooltipContent='activeAdmin'
                      />
                    </td>
                    <td valign='middle'>{user.email}</td>
                    <td valign='middle' className='date'>{formatDate(user.createdAt)}</td>
                    <td valign='middle' className='date'>{formatDate(user.updatedAt)}</td>
                    <td valign='middle' className='btn-actions'>
                      <OverlayTrigger
                        placement='left'
                        overlay={
                          <Tooltip>
                            Edit user
                          </Tooltip>
                        }
                      >
                        <Link to={`/dashboard/user/${user._id}?type=edit`} className='btn btn-primary'><FaEdit/></Link>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement='top'
                        overlay={
                          <Tooltip>
                            Delete user
                          </Tooltip>
                        }
                      >
                        <Button onClick={() => deleteUser(user._id)} variant='danger'><FaTrash/></Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          ): <div className='no-product'>No product</div>}
          <Pagination pages={pages} page={page} url='/dashboard/user'/>
        </div>
      )}
    </DashBoardLayout>
  )
}

export default DashBoardUserList