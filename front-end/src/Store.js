import { createContext, useReducer } from 'react'
import jwt_decode from 'jwt-decode'
import Cookies from 'universal-cookie'

export const Store = createContext()
const cookies = new Cookies()

const initialState = {
  fullBox: false,
  userInfo: cookies.get('aranoz-token') ? jwt_decode(cookies.get('aranoz-token')) : null,
  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')? JSON.parse(localStorage.getItem('shippingAddress')) : { location: {}},
    paymentMethod: localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : '',
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
  }
}

const reducer = (state, action) => {
  switch (action.type) { 
    case "SET_FULL_BOX_ON": {
      return { ...state, fullBox: true}
    }

    case "SET_FULL_BOX_OFF": {
      return { ...state, fullBox: false}
    }

    case "CART_ADD_ITEM": {
      const newItem = action.payload
      const existItem = state.cart.cartItems.find(item => item._id === newItem._id)
      const cartItems = existItem ? state.cart.cartItems.map(item => item._id === existItem._id ? newItem : item) : [...state.cart.cartItems, newItem]
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
      return { ...state, cart: { ...state.cart, cartItems}}
    }

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(item => item._id !== action.payload._id)
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
      return { ...state, cart: { ...state.cart, cartItems}}
    }
      
    case "CART_CLEAR": {
      localStorage.removeItem('cartItems')
      return { ...state, cart: { ...state.cart, cartItems: []}}
    }

    case "USER_SIGN_IN": {
      const userData = jwt_decode(action.payload)
      return { ...state, userInfo: userData}
    }

    case "USER_SIGN_OUT": {
      localStorage.removeItem('shippingAddress')
      localStorage.removeItem('paymentMethod')
      cookies.remove('aranoz-token')
      return { ...state, userInfo: null, cart: {cartItems: [], shippingAddress: {}, paymentMethod: ""}}
    }

    case "SAVE_SHIPPING_ADDRESS": {
      return { ...state, cart: { ...state.cart, shippingAddress: action.payload}}
    }

    case "SAVE_SHIPPING_ADDRESS_MAP_LOCATION": {
      return { ...state, cart: { ...state.cart, shippingAddress: { ...state.cart.shippingAddress, location: action.payload}}}
    }

    case "SAVE_PAYMENT_METHOD": {
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload))
      return { ...state, cart: { ...state.cart, paymentMethod: action.payload}}
    }
  
    default: 
      return state
  }
} 


export const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = {state, dispatch}
  return <Store.Provider value={value}>{props.children}</Store.Provider> 
}