import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Newsletter from '../components/Newsletter'
import { toast } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const { setLoginToken } = useContext(AuthContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitHandler = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post('http://localhost:4000/api/user/login', { email, password })

      if (!response.data.success) {
        toast.error(response.data.message || 'Unable to sign in')
        return
      }

      if (!response.data.token) {
        toast.error('The server did not return an authentication token')
        return
      }

      setLoginToken(response.data.token)
      toast.success(response.data.message || 'Login successful')
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Authentication request failed:', error)
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={submitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Login</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      <input
        id='email'
        name='email'
        placeholder='Email'
        type='email'
        required
        autoComplete='email'
        onChange={(event) => setEmail(event.target.value)}
        value={email}
        className='w-full focus:outline-none border border-gray-800 px-3 py-2'
      />

      <input
        id='password'
        name='password'
        placeholder='Password'
        type='password'
        required
        autoComplete='current-password'
        onChange={(event) => setPassword(event.target.value)}
        value={password}
        className='w-full focus:outline-none border border-gray-800 px-3 py-2'
      />

      <div className='w-full flex justify-between text-sm font-medium mt-[-8px]'>
        <Link to={'/forgot-password'} className='cursor-pointer'>Forgot your Password ?</Link>
        <Link to='/signup' className='cursor-pointer'>Create an Account</Link>
      </div>

      <div className='bg-black text-white font-medium px-3 py-2'>
        <button>Login</button>
      </div>

      <div className='mt-20'>
        <Newsletter />
      </div>
    </form>
  )
}

export default Login
