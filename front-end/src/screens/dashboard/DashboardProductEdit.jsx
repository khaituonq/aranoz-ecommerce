import axios from 'axios'
import { useEffect, useReducer, useState } from 'react'
import { Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { BsArrowBarUp } from 'react-icons/bs'
import { FaListUl, FaSave, FaTimesCircle, FaTrash } from 'react-icons/fa'
import { IoMdCloudUpload } from 'react-icons/io'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'

import DashBoardLayout from '../../components/dashboard/DashBoardLayout'
import InputGroup from '../../components/dashboard/InputGroup'
import Thumbnail from '../../components/dashboard/Thumbnail'
import LoadingBox from '../../components/LoadingBox'
import MessageBox from '../../components/MessageBox'

const reducer = (state, action) => {
  switch (action.type) {
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
    case "UPLOAD_REQUEST": 
      return {...state, loadingUpload: true, errorUpload: ""}
    case "UPLOAD_SUCCESS":
      return {...state, loadingUpload: false, errorUpload: ""}
    case "UPLOAD_FAIL": 
      return {...state, loadingUpload: false, errorUpload: action.payload}
    case "UPLOAD_THUMB_REQUEST": 
      return {...state, loadingThumbUpload: true}
    case "UPLOAD_THUMB_SUCCESS": 
      return {...state, loadingThumbUpload: false, errorThumbUpload: ""}
    case "UPLOAD_THUMB_FAIL":
      return {...state, loadingThumbUpload: false, errorThumbUpload: ""}
    case "DELETE_REQUEST":
      return {...state, loadingDelete: true}
    case "DELETE_SUCCESS": 
      return {...state, loadingDelete: false, errorDelete: ""}
    case "DELETE_FAIL": 
      return {...state, loadingDelete: false, errorDelete: action.payload}
    default:
      return state;
  }
}

const DashboardProductEdit = () => {
  const [{loading, error, loadingUpdate, loadingUpload, loadingDelete, loadingThumbUpload}, dispatch] = useReducer(reducer, {loading: true, error: ''})
  const cookies = new Cookies()
  const navigate = useNavigate()
  const { id: productId } = useParams()
  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const type = sp.get('type')

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [image, setImage] = useState({asset_id: "", public_id: "", secure_url: ""})
  const [thumbnail, setThumbnail] = useState([])
  const [description, setDescription] = useState("")
  const [bannerUsage, setBannerUsage] = useState(false)



  /* The above code is using the useEffect hook to fetch data from an API endpoint for a specific
  product based on the productId. It dispatches actions to update the state with the fetched data,
  including the product name, slug, brand, category, price, stock, thumbnail, description, and
  image. If the type is "create", it sets the image to an empty object, otherwise it sets it to the
  image data fetched from the API. The code also handles errors by dispatching a FETCH_FAIL action
  with the error payload. */
  useEffect(() => {
    const fetchData = async() => {
      try {
        dispatch({type: 'FETCH_REQUEST'})
        const { data } = await axios({
          url: `/api/product/${productId}`,
          method: 'get',
        })

        if (data) {
          setName(data.name)
          setSlug(data.slug)
          setBrand(data.brand)
          setCategory(data.category)
          setPrice(data.price)
          setStock(data.countInStock)
          setThumbnail(data.images)
          setDescription(data.description)
          setBannerUsage(data.bannerUsage)
          if (type === "create") {
            setImage({asset_id: "", public_id: "", secure_url: ""})
          } else {
            setImage(data.image)
          }
        }
        dispatch({type: "FETCH_SUCCESS"})
      } catch (error) {
        dispatch({type: 'FETCH_FAIL', payload: error})
      }
    }

    fetchData()
  }, [productId, type])



  /**
   * This function takes a name, removes any leading or trailing whitespace, replaces any spaces with
   * hyphens, and sets the resulting string as the value of a slug variable.
   */
  const renderSlug = () => {
    if (name === "") {
      return toast.warn('Please enter a product name!')
    } else {
      const slug = name.toLowerCase().trim().split(" ").join("-")
      setSlug(slug)
    }
  }



  /**
   * This is a function that uploads an image file to a server using axios and FormData, and updates
   * the state based on whether it is for a thumbnail or a regular image.
   */
  const uploadImage = async(e, forImages) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("file", file)
    if (!forImages ? file.type === 'image/png' : file) {
      try {
        if (forImages) {
          dispatch({type: 'UPLOAD_THUMB_REQUEST'})
        } else {  
          dispatch({type: 'UPLOAD_REQUEST'})
        }
        const { data } = await axios({
          url: '/api/upload',
          method: "post",
          data: formData,
          headers: {
            'Content-Type' : 'multipart/form-data',
            authorization: `Bearer ${cookies.get('aranoz-token')}`
          },
        })
        
        if (forImages) {
          dispatch({type: 'UPLOAD_THUMB_SUCCESS'})
          setThumbnail(prev => [...prev, {asset_id: data.asset_id, public_id: data.public_id, secure_url: data.secure_url}])
        } else {
          dispatch({type: 'UPLOAD_SUCCESS'})
          setImage({asset_id: data.asset_id, public_id: data.public_id, secure_url: data.secure_url})
        }
      } catch (error) {
        console.log(error)
        toast.error("Image uploaded failed")
        if (forImages) {
          dispatch({type: "UPLOAD_THUMB_FAIL", payload: error})
        } else {
          dispatch({type: "UPLOAD_FAIL", payload: error})
        }
      }
    } else {
      toast.warn('Please upload png image.')
    }
  }



  /**
   * This is an asynchronous function that deletes an image using axios and updates the state
   * accordingly.
   */
  const deleteImage = async(image, forImages) => {
    try {
      if (!forImages) {
        dispatch({type: "DELETE_REQUEST"})
      }
      await axios({
        url: '/api/delete',
        method: 'delete',
        data: {image: image.public_id},
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded',
          authorization: `Bearer ${cookies.get('aranoz-token')}`
        },
      })
      
      if (forImages) {
        setThumbnail(prev => prev.filter(item => item.asset_id !== image.asset_id))
      } else {
        setImage('')
        dispatch({type: "DELETE_SUCCESS"})
      }
    } catch (error) {
      console.log(error)
      if (!forImages) dispatch({type: "DELETE_FAIL", payload: error})
      toast.error("Delete image failed")
    }
  }



  /**
   * The function clears data by resetting multiple state variables and deleting images.
   */
  const clearData = () => {
    setName('')
    setSlug('')
    setBrand('')
    setCategory('')
    setPrice('')
    setStock('')
    setImage('')
    setThumbnail([])
    setDescription('')
    deleteImage(image)
    
    if (thumbnail.length > 0) {
      thumbnail.map(thumb => {
        return deleteImage(thumb, true)
      })
    }
  }



  /**
   * The function saves product data to the server and performs validation checks before doing so.
   */
  const saveData = async() => {
    const data = {
      name, 
      slug,
      image: image,
      images: thumbnail,
      price,
      category,
      brand,
      countInStock: stock,
      rating: 0,
      numReviews: 0,
      description,
      bannerUsage
    }

    if (name === "") {
      toast.warn("Please enter a name for product")
    } else if (slug === "") {
      toast.warn("Please enter a slug for product")
    } else if (brand === "") {
      toast.warn("Please enter a brand for product")
    } else if (category === "") {
      toast.warn("Please enter a category for product")
    } else if (price === "") {
      toast.warn("Please enter a price for product")
    } else if (stock === "") {
      toast.warn("Please enter a stock for product")
    } else if (image.secure_url === "") {
      toast.warn("Please upload an image for product")
    } else if (description === "") {
      toast.warn("Please enter a description for product")
    } else {
      try {
        await axios({
          url: `/api/product/${productId}`,
          method: 'put',
          data: data,
          headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            authorization: `Bearer ${cookies.get('aranoz-token')}`
          }
        })
        
        if (type === "create") {
          toast.success("Create product successfully")
        } else {
          toast.success("Update product successfully")
        }
        
        navigate('/dashboard/products')
      } catch (error) {
        console.log(error)
        toast.error("Save data failed")
      }
    }
  }



 /**
  * This function redirects the user to the products dashboard page, and if the type is "create", it
  * prompts the user to confirm deletion of data before redirecting.
  */
  const redirect = async() => {
    if (type === "create") {
      if (window.confirm('Are you sure want to move, data will be deleted? ')) {
        try {
          await axios({
            url: `/api/product/${productId}`,
            method: 'delete',
            headers: {
              authorization: `Bearer ${cookies.get('aranoz-token')}`
            }
          })
          navigate('/dashboard/products')
        } catch (error) {
          console.log(error)
          toast.error("Redirect failed")
        }
      }
    } else {
      navigate('/dashboard/products')
    }
  }



  return (
    <DashBoardLayout title="Product Dashboard">
      {loading ? <LoadingBox/> : error ? <MessageBox variant="danger">{error}</MessageBox>:
      (
        <Row>
          {/* LEFT form */}
          <Col lg={5}>
            <InputGroup id="product-name" name="Product name" value={name} getValue={setName}/>
            <InputGroup id="product-slug" name="Slug" value={slug} getValue={setSlug} getSlug={renderSlug}/>
            <InputGroup id="product-brand" name="Brand" value={brand} getValue={setBrand}/>
            <InputGroup id="product-brand" name="Category" value={category} getValue={setCategory}/>
            <InputGroup id="product-price" name="Price" value={price} getValue={setPrice}/>
            <InputGroup id="product-stock" name="Stock" value={stock} getValue={setStock}/>
            <div className='py-2 mb-2 form-group'>
              <label className='form-control-label' htmlFor='product-desc'>Banner usage</label>
              <Form>
                <Form.Check
                  inline
                  label={bannerUsage ? 'Yes' : 'No'}
                  name='isAdmin'
                  type="checkbox" 
                  id="admin"
                  checked={bannerUsage}
                  onChange={(e) => setBannerUsage(e.target.checked)}
                />
              </Form>
            </div>
          </Col>

          {/* RIGHT form */}
          <Col lg={7} >
            {/* Image area */}
            <div className='py-2 form-group image-form'>
              {image.secure_url ? (
                <div className='image-upload'>
                  <img src={image.secure_url} alt=""/>
                  <FaTimesCircle 
                    className={`${loadingDelete ? "loading" : ""}`} 
                    size={24} 
                    onClick={() => deleteImage(image)}/>
                </div>
              ) : (
                <>
                  <label 
                    className={`form-control-label upload-button ${loadingUpload ? "loading" : ""}`} 
                    htmlFor='product-image'>
                    <span>
                      Upload
                    </span>
                    <BsArrowBarUp/>
                  </label>
                  <input type='file' hidden className='form-control' id='product-image' onChange={uploadImage}></input>
                </>
              )}
            </div>

            {/* Thumbnails area */}
            <label className='form-control-label'>Thumbnails</label>
            <div className='thumbnails d-flex align-items-center justify-content-between'>
              <ul className='d-flex'>
                {thumbnail.length > 0 ? thumbnail.map((thumb, index) => 
                <Thumbnail 
                  key={index}
                  thumb={thumb} 
                  deleteImage={deleteImage}
                />) : <span>No images uploaded</span>}
              </ul>
              <input type="file" hidden id='thumbnail' onChange={(e) => {
                if (thumbnail.length < 5) {
                  uploadImage(e, true)
                } else {
                  toast.warn("You can only upload up to 5 photos")
                }
              }}/>
              <OverlayTrigger
                placement='top'
                overlay={
                  <Tooltip>
                    Upload image
                  </Tooltip>
                }
              >
                <label htmlFor="thumbnail" className='upload-thumb'>
                  <IoMdCloudUpload className={`${loadingThumbUpload? "loading" : ""}`}/>
                </label>
              </OverlayTrigger>
            </div>

            {/* Description area */}
            <div className='py-2 mb-2 form-group'>
              <label className='form-control-label' htmlFor='product-desc'>Description</label>
              <textarea value={description} className='form-control' id='product-desc' rows="9" onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            {/* Button area */}
            <div className='d-flex justify-content-end gap-2 action'>
              <OverlayTrigger
                placement='left'
                overlay={
                  <Tooltip>
                    Product list
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
                    Save data
                  </Tooltip>
                }
              >
                <button className={`${loadingUpdate ? "loading" : ""}`} onClick={saveData}><FaSave/></button>
              </OverlayTrigger>
            </div>
          </Col>
        </Row>
      )}
    </DashBoardLayout>
  )
}

export default DashboardProductEdit