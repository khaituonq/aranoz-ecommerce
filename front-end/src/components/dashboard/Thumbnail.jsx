import React, { useState } from 'react'
import { FaTimesCircle } from 'react-icons/fa'

const Thumbnail = ({thumb, deleteImage}) => {
  const [loadingDelete, setLoadingDelete] = useState(false)
  
  return (
    <li>
      <img src={thumb.secure_url} alt="" />
      <FaTimesCircle 
        className={`${loadingDelete === thumb.asset_id ? "loading" : ""}`} 
        size={20} 
        onClick={() => {
          setLoadingDelete(thumb.asset_id)
          deleteImage(thumb, true)
        }}
      />
    </li>
  )
}

export default Thumbnail