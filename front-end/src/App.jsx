import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './App.scss'
import DashBoardUserEdit from './screens/dashboard/DashBoardUserEdit'
import DashBoardUserList from './screens/dashboard/DashBoardUserList'
import Dashboard from './screens/dashboard/Dashboard'
import DashboardProductEdit from './screens/dashboard/DashboardProductEdit'
import DashboardProductList from './screens/dashboard/DashboardProductList'
import Auth from './screens/shop/Auth'
import Cart from './screens/shop/Cart'
import Home from './screens/shop/Home'
import Order from './screens/shop/Order'
import Payment from './screens/shop/Payment'
import PlaceOrder from './screens/shop/PlaceOrder'
import Product from './screens/shop/Product'
import Shipping from './screens/shop/Shipping'
import Search  from './screens/shop/Search'
import DashboardOrderList from './screens/dashboard/DashboardOrderList'
import Success from './screens/shop/Success'
import axios from 'axios'

function App() {
  // axios.defaults.baseURL = 'https://aranoz-api.onrender.com'
  axios.defaults.baseURL = 'http://localhost:5000'
  return (
    <BrowserRouter>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/product/:slug' element={<Product/>}/>
        <Route path='/auth' element={<Auth/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/shipping' element={<Shipping/>}/>
        <Route path='/payment' element={<Payment/>}/>
        <Route path='/placeorder' element={<PlaceOrder/>}/>
        <Route path='/order/:id' element={<Order/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/success' element={<Success/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/dashboard/products' element={<DashboardProductList/>}/>
        <Route path='/dashboard/product/:id' element={<DashboardProductEdit/>}/>
        <Route path='/dashboard/users' element={<DashBoardUserList/>}/>
        <Route path='/dashboard/user/:id' element={<DashBoardUserEdit/>}/>
        <Route path='/dashboard/orders' element={<DashboardOrderList/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;