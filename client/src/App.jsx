import React, { lazy, Suspense } from 'react';
import Navbar from './components/Navbar.jsx';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext.jsx';
import Footer from './components/Footer.jsx';
import Login from './components/Login.jsx';
import CartPopup from './components/CartPopUp.jsx';

// ✅ Halaman yang sering dikunjungi — tetap eager
import Home from './pages/Home.jsx';

// ✅ Sisanya lazy load
const About = lazy(() => import('./pages/About.jsx'));
const AllProducts = lazy(() => import('./pages/AllProducts.jsx'));
const ProductCategories = lazy(() => import('./pages/ProductCategories.jsx'));
const ProductDetails = lazy(() => import('./pages/ProductDetails.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const MyOrders = lazy(() => import('./pages/MyOrders.jsx'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));

// ✅ Seller — paling berat, wajib lazy
const SellerLogin = lazy(() => import('./components/seller/SellerLogin.jsx'));
const SellerLayout = lazy(() => import('./pages/seller/SellerLayout.jsx'));
const AddProduct = lazy(() => import('./components/seller/AddProduct.jsx'));
const ProductList = lazy(() => import('./components/seller/ProductList.jsx'));
const Orders = lazy(() => import('./components/seller/Orders.jsx'));
const Transactions = lazy(() => import('./components/seller/Transaction.jsx'));

// Loading fallback — bisa diganti spinner custom
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const { showUserLogin, isSeller, showCartPopup, setShowCartPopup } = useAppContext();

  React.useEffect(() => {
    if (location.pathname === "/cart") {
      setShowCartPopup(false);
    }
  }, [location.pathname]);

  return (
    <div className="text-default text-gray-700 bg-white min-h-screen flex flex-col w-full">
      {isSellerPath ? null : <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />
      {showCartPopup && <CartPopup />}

      <main className={`flex-1 ${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        {/* ✅ Suspense wajib membungkus Routes kalau ada lazy */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path='/products' element={<AllProducts />} />
            <Route path='/products/:category' element={<ProductCategories />} />
            <Route path='/products/:category/:id' element={<ProductDetails />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/my-orders' element={<MyOrders />} />
            <Route path='/verify-email/:token' element={<VerifyEmail />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />

            <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
              <Route index element={isSeller ? <AddProduct /> : null} />
              <Route path='product-list' element={<ProductList />} />
              <Route path='orders' element={<Orders />} />
              <Route path='transactions' element={<Transactions />} />
            </Route>
          </Routes>
        </Suspense>
      </main>

      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;