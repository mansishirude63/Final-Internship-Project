import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import RegisterUser from './components/accounts/RegisterUser'
import LoginUser from './components/accounts/LoginUser'
import UserList from './components/accounts/UserList'
import UserDetails from './components/accounts/UserDetails'
import EditUser from "./components/accounts/EditUser"

import MenuList from './components/menu/MenuList'
import MenuDetails from './components/menu/MenuDetails'
import AddMenu from './components/menu/AddMenu'
import EditMenu from './components/menu/EditMenu'

import CartList from './components/cart/CartList'
import CartDetails from './components/cart/CartDetails'
import AddCart from './components/cart/AddCart'
import EditCart from './components/cart/EditCart'

import OrderList from './components/orders/OrderList'
import OrderDetails from './components/orders/OrderDetails'
import AddOrder from './components/orders/AddOrder'
import EditOrder from './components/orders/EditOrder'

import PaymentList from './components/payments/PaymentList'
import PaymentDetails from './components/payments/PaymentDetails'
import AddPayment from './components/payments/AddPayment'
import EditPayment from './components/payments/EditPayment'

import DeliveryList from './components/delivery/DeliveryList'
import DeliveryDetails from './components/delivery/DeliveryDetails'
import AddDelivery from './components/delivery/AddDelivery'
import EditDelivery from './components/delivery/EditDelivery'

import GroupOrder from './components/groupOrder/GroupOrder';
import GroupRoom from './components/groupOrder/GroupRoom';
import GroupCart from './components/groupOrder/GroupCart';


function App() {

  return (

    <Routes>
      <Route path='/' element={<Home />} ></Route>

      <Route path='/accounts/register' element={<RegisterUser />} />
      <Route path='/accounts/login' element={<LoginUser />} />
      <Route path='/accounts/users' element={<UserList />} />
      <Route path='/accounts/users/:id' element={<UserDetails />} />
      <Route path='/accounts/users/:id/edit' element={<EditUser />} />

      <Route path="/menu" element={<MenuList />} />
      <Route path="/menu/:id" element={<MenuDetails />} />
      <Route path="/menu/add" element={<AddMenu />} />
      <Route path="/menu/edit/:id" element={<EditMenu />} />

      <Route path="/cart" element={<CartList />} />
      <Route path="/cart/:id" element={<CartDetails />} />
      <Route path="/cart/add" element={<AddCart />} />
      <Route path="/cart/edit/:id" element={<EditCart />} />

      <Route path="/orders" element={<OrderList />} />
      <Route path="/order-details/:id" element={<OrderDetails />} />
      <Route path="/orders/place_order" element={<AddOrder />} />
      <Route path="/orders/:id" element={<EditOrder />} />

      <Route path="/payments" element={<PaymentList />} />
      <Route path="/payments/:id" element={<PaymentDetails />} />
      <Route path="/payment/:orderId" element={<AddPayment />} />
      <Route path="/payments/edit/:id" element={<EditPayment />} />

      <Route path="/delivery" element={<DeliveryList />} />
      <Route path="/delivery/:orderId" element={<DeliveryDetails />} />
      <Route path="/delivery/add" element={<AddDelivery />} />
      <Route path="/delivery/edit/:id" element={<EditDelivery />} />

      <Route path="/group-order" element={<GroupOrder />}/>
      <Route path="/group-order/:groupCode" element={<GroupRoom />}/>
      <Route path="/group-order/:groupCode/cart" element={<GroupCart />}/>



    </Routes>

  )
}

export default App
