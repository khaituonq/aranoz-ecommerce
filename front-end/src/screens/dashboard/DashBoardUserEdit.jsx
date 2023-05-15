import axios from 'axios'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { FaListUl, FaSave, FaTrash } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'

import { Store } from '../../Store'
import LoadingBox from '../../components/LoadingBox'
import DashBoardLayout from '../../components/dashboard/DashBoardLayout'
import InputGroup from '../../components/dashboard/InputGroup'
import MessageBox from '../../components/MessageBox'


const reducer = (state, action) => {
  switch(action.type) {
    case "FETCH_REQUEST":
      return {...state, loading: true}
    case "FETCH_SUCCESS": 
      return {...state, loading: false}
    case "FETCH_FAIL": 
      return {...state, loading: false, error: action.payload}
    case "UPDATE_REQUEST":
      return {...state, loadingUpdate: true}
    case "UPDATE_SUCCESS":
      return {...state, loadingUpdate: false}
    case "UPDATE_FAIL":
      return {...state, loadingUpdate: false}

    default: 
      return state
  }
}

const DashBoardUserEdit = () => {
  const [{loading, error, loadingUpdate}, dispatch] = useReducer(reducer, {loading: true, error: ''})
  const { state } = useContext(Store)
  const { userInfo } = state
  const { id: userId } = useParams()
  const navigate = useNavigate()
  const cookies = new Cookies()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(true)



  /* The `useEffect` hook is used to fetch user data from the server when the component mounts or when
  the `userId` or `userInfo` values change. It dispatches actions to update the state of the
  component based on the status of the data fetch. If the fetch is successful, it sets the `name`,
  `email`, and `isAdmin` values to the data received from the server. If there is an error, it logs
  the error and dispatches an action to update the state with the error message. */
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({type: 'FETCH_REQUEST'})
        const { data } = await axios({
          url: `/api/user/${userId}`,
          method: 'get',
          headers: {
            authorization: `Bearer ${cookies.get('aranoz-token')}`
          }
        })

        if (data) {
          setName(data.name)
          setEmail(data.email)
          setIsAdmin(data.isAdmin)
        }

        dispatch({type: 'FETCH_SUCCESS'})
      } catch (error) {
        dispatch({type: 'FETCH_FAIL', payload: error})
        console.log(error)
      }
    }

    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userId, userInfo])



  /**
   * This function redirects the user to the '/dashboard/users' page.
   */
  const redirect = () => {
    navigate('/dashboard/users')
  }



  /**
   * The function clears the name, email, and isAdmin values.
   */
  const clearData = () => {
    setName('')
    setEmail('')
    setIsAdmin(false)
  }




  /**
   * This function updates user data and displays success or error messages using Axios and React.
   */
  const saveData = async() => {
    if (name === "") {
      toast.warn("Please enter a name for user")
    } else if (email === "") {
      toast.warn("Please enter a email for user")
    } else {
      try {
        dispatch({type: 'UPDATE_REQUEST'})
        await axios({
          url: `/api/user/${userId}`,
          method: 'put',
          data: {name, email, isAdmin},
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            authorization: `Bearer ${cookies.get('aranoz-token')}`
          }
        })
  
        dispatch({type: 'UPDATE_SUCCESS'})
        toast.success("Update user successfully")
        navigate('/dashboard/users')
      } catch (error) {
        console.log(error)
        dispatch({type: 'UPDATE_FAIL'})
        toast.error("Update user failed")
      }
    }
  }



  return (
    <DashBoardLayout title="User Dashboard">
      {loading ? <LoadingBox/> : error ? <MessageBox variant="danger">{error}</MessageBox> : (
        <Row>
          <Col>
            <InputGroup id="user-name" name="User name" value={name} getValue={setName}/>
            <InputGroup id="user-email" name="User email" value={email} getValue={setEmail}/>
            <div className='py-2 mb-2 form-group'>
              <label className='form-control-label' htmlFor='product-desc'>Admin</label>
              <Form>
                <Form.Check
                  inline
                  label={isAdmin ? 'Yes' : 'No'}
                  name='isAdmin'
                  type="checkbox" 
                  id="admin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
              </Form>
            </div>

            {/* Button area */}
            <div className='d-flex justify-content-end gap-2 action'>
              <OverlayTrigger
                placement='left'
                overlay={
                  <Tooltip>
                    User list
                  </Tooltip>
                }
              >
                <button onClick={redirect}><FaListUl/></button>
              </OverlayTrigger>
              <OverlayTrigger
                placement='top'
                overlay={
                  <Tooltip>
                    Clear data
                  </Tooltip>
                }
              >
                <button onClick={clearData}><FaTrash/></button>
              </OverlayTrigger>
              <OverlayTrigger
                placement='bottom'
                overlay={
                  <Tooltip>
                    Save product
                  </Tooltip>
                }
              >
                <button className={loadingUpdate ? "loading" : ""} onClick={saveData}><FaSave/></button>
              </OverlayTrigger>
            </div>
          </Col>
        </Row>
      )}
    </DashBoardLayout>
  )
}

export default DashBoardUserEdit