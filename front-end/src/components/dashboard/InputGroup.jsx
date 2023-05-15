import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { SiConvertio } from 'react-icons/si'

const InputGroup = ({id, name, value, getValue, getSlug}) => {
  
  return (
    <div className='py-2 form-group'>
      {id === "product-slug" ?
        <>
          <label className='form-control-label' htmlFor={id}>{name}</label>
          <div className='d-flex gap-3 slug'>
            <input onChange={(e) => getValue(e.target.value)} type="text" value={value} id={id} className='form-control'/>
            <OverlayTrigger
              placement='top'
              overlay={
                <Tooltip>
                  Render slug
                </Tooltip>
              }
            >
              <button onClick={getSlug}><SiConvertio/></button>
            </OverlayTrigger>
          </div>
        </> : 
        <>
          <label className='form-control-label' htmlFor={id}>{name}</label>
          <input onChange={(e) => getValue(e.target.value)} type="text" value={value} id={id} className='form-control'/>
        </>
      }
    </div>
  )
}

export default InputGroup