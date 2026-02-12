import React from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext.jsx';
import Footer from './components/Footer.jsx';
import Login from './components/Login.jsx';
import AllProducts from './pages/AllProducts.jsx';
import ProductCategories from './pages/ProductCategories.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import MyOrders from './pages/MyOrders.jsx';
import SellerLogin from './components/seller/SellerLogin.jsx';
import SellerLayout from './pages/seller/SellerLayout.jsx';
import AddProduct from './components/seller/AddProduct.jsx';
import ProductList from './components/seller/ProductList.jsx';
import Orders from './components/seller/Orders.jsx';
import Transactions from './components/seller/Transaction.jsx';
import CartPopup from './components/CartPopUp.jsx';


const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const { showUserLogin, isSeller, showCartPopup, setShowCartPopup } = useAppContext();

  // ✨ Tambahkan efek ini
React.useEffect(() => {
  // ❌ Jangan tutup popup di semua halaman
  // ✅ Cuma tutup kalau pindah ke /cart biar gak ganggu checkout
  if (location.pathname === "/cart") {
    setShowCartPopup(false);
  }
}, [location.pathname]);


  return (
    <div className=" text-default text-gray-700 bg-white min-h-screen w-full">
      {isSellerPath ? null : <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />
      {showCartPopup && <CartPopup />}

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />}/>
          <Route path='/products/:category' element={<ProductCategories />}/>
          <Route path='/products/:category/:id' element={<ProductDetails />}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/my-orders' element={<MyOrders />}/>
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
            <Route index element={isSeller ? <AddProduct/> : null}/>
            <Route path='product-list' element={<ProductList/>}/>
            <Route path='orders' element={<Orders/>}/>
            <Route path='transactions' element={<Transactions/>}/>
          </Route>
        </Routes>
      </div>

      {!isSellerPath && <Footer />}
    </div>
  )
}


export default App
