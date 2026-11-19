import { Navigate, Route, Routes } from "react-router-dom"
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

function App() {

  const {loginToken} = useContext(AuthContext);

  useEffect( () => {
    localStorage.setItem("user-login-token", loginToken);
  }, [loginToken])

  return (
   <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Toaster />

      {!loginToken || loginToken === '' ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) :
       (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
          <Navbar />
          <SearchBar />
          <Routes>
            <Route path="/" element={ <Home/> } />
            <Route path="/collection" element={ <Collection /> } />
            <Route path="/about" element={ <About /> } />
            <Route path="/contact" element={ <Contact/> } />
            <Route path="/product/:productId" element={ <Product/> } />
            <Route path="/cart" element={ <Cart/> } />
            <Route path="/login" element={ <Navigate to="/" replace /> } />
            <Route path="/signup" element={ <Navigate to="/" replace /> } />
            <Route path="/place-order" element={ <Placeorder/> } />
            <Route path="/orders" element={ <Orders/> } />
          </Routes>
        </div>
       )
      }
      <Footer />
   </div>
  )
}

export default App
