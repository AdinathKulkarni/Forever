import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'
import { ShopContext } from '../context/ShopContext'
import { BACKEND_URL } from '../api'

const VerifyPayment = () => {
  const [searchParams] = useSearchParams()
  const { loginToken } = useContext(AuthContext)
  const { setCartItems } = useContext(ShopContext)
  const [status, setStatus] = useState('verifying')
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    let cancelled = false

    const verifyPayment = async () => {
      if (!sessionId || !loginToken) {
        setStatus('failed')
        return
      }

      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/order/verify-stripe`,
          { sessionId },
          { headers: { token: loginToken } },
        )
        if (!response.data.success) throw new Error(response.data.message || 'Payment verification failed')
        if (!cancelled) {
          setCartItems({})
          setStatus('success')
          toast.success(response.data.message)
        }
      } catch (error) {
        if (!cancelled) {
          setStatus('failed')
          toast.error(error.response?.data?.message || error.message || 'Unable to verify payment')
        }
      }
    }

    verifyPayment()
    return () => {
      cancelled = true
    }
  }, [sessionId, loginToken, setCartItems])

  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center'>
      <h1 className='text-2xl font-medium'>
        {status === 'verifying' && 'Verifying your payment...'}
        {status === 'success' && 'Payment successful'}
        {status === 'failed' && 'Payment could not be verified'}
      </h1>
      {status === 'verifying' && <p>Please wait while we confirm your order.</p>}
      {status === 'success' && <Link to='/orders' className='bg-black px-6 py-3 text-white'>View your orders</Link>}
      {status === 'failed' && <Link to='/place-order' className='bg-black px-6 py-3 text-white'>Return to checkout</Link>}
    </div>
  )
}

export default VerifyPayment
