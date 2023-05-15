import { useContext, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'

import NavDashboard from './NavDashboard'
import { Store } from '../../Store'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingBox from '../../components/LoadingBox'

const DashBoardLayout = ({children, title}) => {
  const navigate = useNavigate()
  const { state } = useContext(Store)
  const { userInfo } = state
  const isMobile = window.innerWidth <= 768

  useEffect(() => {
    document.title = title ? title : "Aranoz"
  },[title])

  useEffect(() => {
    if (!userInfo.isAdmin) {
      navigate('/')
    }
  },[userInfo.isAdmin, navigate])

  useEffect(() => {
    if (isMobile) {
      toast.warn('The site does not support this device!');
    }
  },[isMobile])

  return (
    <>
      {isMobile ? <LoadingBox/> : (
        <Row className='layout-dashboard'>
          <Col lg={2} md={4} className='h-100vh'>
            <NavDashboard/>
          </Col>
      
          <Col lg={10} md={8} className='content'>
            {/* <div className="banner">
              <h2>{title}</h2>
            </div> */}
            <div className='p-3 area'>
              <div className='wrap'>{children}</div>
            </div>
          </Col>
        </Row>
      )}
    </>
  )
}

export default DashBoardLayout