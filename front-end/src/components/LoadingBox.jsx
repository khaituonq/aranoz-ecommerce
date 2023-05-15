import React from 'react'
import { Spinner } from 'react-bootstrap'

const LoadingBox = ({height}) => {
  return (
    <div
    className="d-flex align-items-center justify-content-center loading-box"
    style={{height: height ? height : "50vh"}}
  >
    <Spinner size='lg' animation="border" role="status" variant='secondary'>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
  )
}

export default LoadingBox