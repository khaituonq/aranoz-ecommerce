import axios from 'axios'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Store } from '../../Store'

const Card = ({product}) => {
  const {state, dispatch} = useContext(Store)
  const {cart} = state

  const addCart = async() => {
    const existItem = cart.cartItems.find(x => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/product/${product._id}`)
    if (data.countInStock < quantity) {
      return toast.warn("Sorry. Product is out of stock")
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: {...product, quantity}
    })
    toast.success(`1 product added to cart.`)
  }

  return (
    <section className='card-item'>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image.secure_url} alt="" />
      </Link>
      <div className='card-content'>
        <Link to={`/product/${product.slug}`}>
          <h4>{product.name}</h4>
        </Link>
        <span>${product.price}</span>
        
        <div className="d-flex justify-content-between align-items-center card-action">
          <button onClick={addCart}>+ add to cart <span className='cart-item'></span></button>
          {/* <AiOutlineHeart/> */}
        </div>
      </div>
    </section>
  )
}

export default Card