import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast';
import Navbar from './component/common/Navbar'
import Sidebar from './component/common/Sidebar'
import { Route, Routes } from 'react-router'
import AddItems from './pages/AddItems'
import Orders from './pages/Orders'
import ListItems from './pages/ListItems'
import Login from './component/Login.jsx'

function App() {

  const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : '');

  useEffect( () => {
    localStorage.setItem("token", token)
  },[token] )

  return (
    <div className='bg-gray-50 min-h-screen'>
      <Toaster toastOptions={{ duration: 3000 }} />
      {
        (!token || token === '') ? <Login setToken={setToken} /> 
        : 
        <>
          <Navbar setToken={setToken} />
          <div className='flex w-full'>
            <Sidebar />
            <div className='min-w-0 flex-1'>
              <Routes>
                <Route path='/' element={<AddItems token={token} />} />
                <Route path='/list-items' element={<ListItems token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App
