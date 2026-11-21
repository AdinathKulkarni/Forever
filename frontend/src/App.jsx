import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import Home from "./pages/Home"
import Collection from "./pages/Collection"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Product from "./pages/Product"
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Placeorder from "./pages/Placeorder"
import Orders from "./pages/Orders"
import Navbar from "./components/common/Navbar"
import Footer from "./components/common/Footer"
import SearchBar from "./components/SearchBar"
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import ForgotPassword from "./pages/ForgotPassword"
import VerifyOTP from "./pages/VerifyOTP"
import VerifyPayment from "./pages/VerifyPayment"

const RequireAuth = ({ children }) => {
  const { loginToken } = useContext(AuthContext)
  const location = useLocation()

  return loginToken
    ? children
    : <Navigate to="/login" replace state={{ from: location }} />
}

function App() {

  const {loginToken} = useContext(AuthContext);
  const location = useLocation()
  const returnTo = location.state?.from
  const authenticatedRedirect = returnTo
    ? `${returnTo.pathname}${returnTo.search || ''}${returnTo.hash || ''}`
    : '/'

  useEffect( () => {
    localStorage.setItem("user-login-token", loginToken);
  }, [loginToken])

  return (
   <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Toaster />
      <div className="sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Navbar />
        <SearchBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={loginToken ? <Navigate to={authenticatedRedirect} replace /> : <Login />} />
          <Route path="/signup" element={loginToken ? <Navigate to={authenticatedRedirect} replace /> : <Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/place-order" element={<RequireAuth><Placeorder /></RequireAuth>} />
          <Route path="/verify" element={<RequireAuth><VerifyPayment /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
        </Routes>
      </div>
      <Footer />
   </div>
  )
}

export default App
