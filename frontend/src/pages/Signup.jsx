import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Newsletter from '../components/Newsletter'
import { toast } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'
import { BACKEND_URL } from '../api'

const Signup = () => {
  const { setLoginToken } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpSending, setOtpSending] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))

    if (name === 'email') {
      setOtp('')
      setOtpSent(false)
    }
  }

  const sendOtpHandler = async () => {
    if (!formData.email) {
      toast.error('Enter your email before requesting a verification code')
      return
    }

    try {
      setOtpSending(true)
      const response = await axios.post(`${BACKEND_URL}/api/user/send-otp`, { email: formData.email })

      if (!response.data.success) {
        toast.error(response.data.message || 'Unable to send verification code')
        return
      }

      setOtp('')
      setOtpSent(true)
      toast.success(response.data.message || 'Verification code sent')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send verification code')
    } finally {
      setOtpSending(false)
    }
  }

  const submitHandler = async (event) => {
    event.preventDefault()

    if (!otpSent) {
      toast.error('Send a verification code to your email before signing up')
      return
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp,
      })

      if (!response.data.success) {
        toast.error(response.data.message || 'Unable to sign in')
        return
      }

      if (!response.data.token) {
        toast.error('The server did not return an authentication token')
        return
      }

      setLoginToken(response.data.token)
      toast.success(response.data.message || 'Account created')
      const destination = location.state?.from
      navigate(
        destination
          ? `${destination.pathname}${destination.search || ''}${destination.hash || ''}`
          : '/',
        { replace: true },
      )
    } catch (error) {
      console.error('Authentication request failed:', error)
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={submitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Sign Up</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      <input
        id='name'
        name='name'
        placeholder='Name'
        type='text'
        required
        onChange={handleChange}
        value={formData.name}
        className='w-full focus:outline-none border border-gray-800 px-3 py-2'
      />

      <input
        id='email'
        name='email'
        placeholder='Email'
        type='email'
        required
        autoComplete='email'
        onChange={handleChange}
        value={formData.email}
        className='w-full focus:outline-none border border-gray-800 px-3 py-2'
      />

      <button
        type='button'
        onClick={sendOtpHandler}
        disabled={otpSending}
        className='w-full border border-gray-800 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {otpSending ? 'Sending code...' : otpSent ? 'Resend verification code' : 'Send verification code'}
      </button>

      <input
        name='otp'
        type='text'
        inputMode='numeric'
        pattern='[0-9]{6}'
        maxLength={6}
        required
        value={otp}
        onChange={(event) => setOtp(event.target.value)}
        placeholder='6-digit verification code'
        autoComplete='one-time-code'
        className='w-full focus:outline-none border border-gray-800 px-3 py-2'
      />

      <input
        id='password'
        name='password'
        placeholder='Password'
        type='password'
        required
        minLength={8}
        autoComplete='new-password'
        onChange={handleChange}
        value={formData.password}
        className='w-full focus:outline-none border border-gray-800 px-3 py-2'
      />

      <div className='w-full flex justify-end text-sm font-medium mt-[-8px]'>
        <Link to='/login' state={location.state} className='cursor-pointer'>Already a user ? Login</Link>
      </div>

      <div className='bg-black text-white font-medium px-3 py-2'>
        <button>Sign Up</button>
      </div>

      <div className='mt-20'>
        <Newsletter />
      </div>
    </form>
  )
}

export default Signup
