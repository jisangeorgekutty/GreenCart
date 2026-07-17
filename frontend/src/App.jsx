import React from 'react';
import NavBar from './components/NavBar';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import Login from './components/Login';
import { useAuthStore } from './store/useAuthStore.js';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import SellerDashboard from './pages/seller/SellerDashboard.jsx';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList.jsx';
import Orders from './pages/seller/Orders';
import { useEffect } from 'react';
import { useProductStore } from './store/useProductStore.js';
import Loading from './components/Loading.jsx';
import PaymentStatusPage from './pages/PaymentStatusPage .jsx';
import { useCartStore } from './store/useCartStore.js';



function App() {
  const isSellerPath = useLocation().pathname.includes('seller');
  const { setUserLoginWindow, checkAuth, isSeller, authUser } = useAuthStore();
  const { getAllProducts } = useProductStore();
  const { loadCartFromDB } = useCartStore();
  const navigate = useNavigate();

  const isPaymentCallbackPage = location.pathname.startsWith('/payment/');
  useEffect(() => {
    getAllProducts();
  }, []);

  // useEffect(() => {
  //   // Only run checkAuth if the current page is NOT a payment callback
  //   if (!isPaymentCallbackPage) {
  //     checkAuth();
  //   }
  // }, [checkAuth, isPaymentCallbackPage]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser && isSeller) {
      navigate("/seller");
    } else if (authUser && isSeller == false && !isPaymentCallbackPage) {
      navigate("/");
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      loadCartFromDB({ userId: authUser.id });
    }
  }, [authUser])

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {isSellerPath ? null : <NavBar />}
      {setUserLoginWindow ? <Login /> : null}

      <Toaster />

      <div className={`${isSellerPath ? '' : 'px-6 md:px-16 lg:px-24 xl:px-32'}`}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/all-products/:category" element={<ProductCategory />} />
          <Route path="/all-products/:category/:id" element={<ProductDetails />} />
          <Route path="/payment/success" element={<PaymentStatusPage />} />
          <Route path="/payment/failed" element={<PaymentStatusPage />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/loader' element={<Loading />} />
          <Route path='/seller' element={<SellerDashboard />} >
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='orders' element={<Orders />} />
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App