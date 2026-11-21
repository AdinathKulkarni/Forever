import { useContext, useState } from 'react'
import axios from 'axios'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import { AuthContext } from '../context/AuthContext'
import { assets } from '../assets/frontend_assets/assets'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BACKEND_URL } from '../api'

const loadRazorpayScript = () => new Promise((resolve) => {
  if (window.Razorpay) {
    resolve(true)
    return
  }

  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => resolve(true)
  script.onerror = () => resolve(false)
  document.body.appendChild(script)
})

const Placeorder = () => {
  
  const navigate = useNavigate();
  const {currency, subtotal, deliveryFee, cartData, setCartItems} = useContext(ShopContext);
  const {loginToken} = useContext(AuthContext);
  const [method, setMethod] = useState('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    city: '',
  });

  const onChangeHandler = (e) => {
    const {name, value} = e.target;

    setFormData( (prev) => ({
      ...prev, 
      [name]: value,
    }) );
  }

  const submitHandler = async(e) => {
    e.preventDefault();
    if (submitting) return;
    if (cartData.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    if (!loginToken) {
      toast.error('Please log in to place an order');
      return;
    }
    let razorpayCheckoutOpened = false;
    try {
      setSubmitting(true);
      const items = cartData.map((item) => ({
        productId: item._id,
        size: item.size,
        quantity: item.quantity,
      }));
      const address = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
      };

      if (method === 'Razorpay') {
        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) throw new Error('Unable to load Razorpay Checkout. Please try again.')

        const response = await axios.post(
          `${BACKEND_URL}/api/order/razorpay`,
          { items, address },
          { headers: { token: loginToken } },
        )
        if (!response.data.success || !response.data.orderId || !response.data.key) {
          throw new Error(response.data.message || 'Unable to start Razorpay checkout')
        }

        const checkout = new window.Razorpay({
          key: response.data.key,
          order_id: response.data.orderId,
          amount: response.data.amount,
          currency: response.data.currency,
          name: response.data.name,
          description: response.data.description,
          prefill: response.data.prefill,
          handler: async (paymentDetails) => {
            try {
              const verification = await axios.post(
                `${BACKEND_URL}/api/order/verify-razorpay`,
                paymentDetails,
                { headers: { token: loginToken } },
              )
              if (!verification.data.success) {
                throw new Error(verification.data.message || 'Unable to verify payment')
              }
              setCartItems({})
              toast.success(verification.data.message || 'Payment successful')
              navigate('/orders')
            } catch (error) {
              console.error('Razorpay payment verification failed:', error.response?.data || error.message)
              toast.error(error.response?.data?.message || error.message || 'Unable to verify payment')
            } finally {
              setSubmitting(false)
            }
          },
          modal: {
            ondismiss: () => setSubmitting(false),
          },
          theme: { color: '#161d29' },
        })

        checkout.on('payment.failed', (event) => {
          toast.error(event.error?.description || 'Razorpay payment failed')
          setSubmitting(false)
        })
        checkout.open()
        razorpayCheckoutOpened = true
        return
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/order/${method === 'Stripe' ? 'stripe' : 'place-order'}`,
        { items, address },
        { headers: { token: loginToken } },
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Unable to place order');
      }

      if (method === 'Stripe') {
        if (!response.data.session_url) {
          throw new Error('Stripe did not return a checkout URL');
        }
        window.location.assign(response.data.session_url);
        return;
      }

      setCartItems({});
      toast.success(response.data.message || 'Order placed successfully');
      navigate('/orders');
    } catch (error) {
      console.error('Error while placing order:', error);
      toast.error(error.response?.data?.message || error.message || 'Unable to place order');
    } finally {
      if (!razorpayCheckoutOpened) setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitHandler}
    className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

        {/* Form */}

      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
          <div className='text-xl sm:text-2xl my-3'>
             <Title text1={'Delivery'} text2={' Information'} />
          </div>

          <div className='flex gap-3'>
              <input 
              placeholder='First name'
              className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md w-full'
              required
              value={formData.firstName}
              type='text'
              id='firstName'
              name='firstName'
              onChange={onChangeHandler}
              />

              <input 
              placeholder='Last name'
              className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md w-full'
              required
              value={formData.lastName}
              type='text'
              id='lastName'
              name='lastName'
              onChange={onChangeHandler}
              />
          </div>

          <input 
            placeholder='Email address'
            className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md'
            required
            value={formData.email}
            type='email'
            id='email'
            name='email'
            onChange={onChangeHandler}
          />

          <input 
            placeholder='Street'
            className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md'
            required
            value={formData.street}
            type='text'
            id='street'
            name='street'
            onChange={onChangeHandler}
          />

          <div className='flex gap-3'>
              <input 
              placeholder='City'
              className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md w-full'
              required
              value={formData.city}
              type='text'
              id='city'
              name='city'
              onChange={onChangeHandler}
              />

              <input 
              placeholder='State'
              className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md w-full'
              required
              value={formData.state}
              type='text'
              id='state'
              name='state'
              onChange={onChangeHandler}
              />
          </div>

          <div className='flex gap-3'>
              <input 
              placeholder='Zip Code'
              className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md w-full'
              required
              value={formData.zipCode}
              type='text'
              id='zipCode'
              name='zipCode'
              onChange={onChangeHandler}
              />

              <input 
              placeholder='Country'
              className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md w-full'
              required
              value={formData.country}
              type='text'
              id='country'
              name='country'
              onChange={onChangeHandler}
              />
          </div>

          <input 
            placeholder='Phone'
            className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md'
            required
            value={formData.phone}
            type='text'
            id='phone'
            name='phone'
            onChange={onChangeHandler}
          />
      </div>

      {/* Right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal currency={currency} deliveryFee={deliveryFee} subtotal={subtotal} />
        </div>

        <div className='mt-12'>
          <div className="text-2xl mb-3">
            <Title text1={'Payment'} text2=" Method" />
          </div>

            {/* payment method selection */}
          <div className='flex gap-3 flex-col lg:flex-row'>
              
              <div onClick={()=>setMethod('Stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                  <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'Stripe' ? 'bg-green-400' : ''}`}></p>
                  <img src={assets.stripe_logo} className='h-5 mx-4' />
              </div>

              <div onClick={()=>setMethod('Razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                  <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'Razorpay' ? 'bg-green-400' : ''} `}></p>
                  <img src={assets.razorpay_logo} className='h-5 mx-4' />
              </div>

              <div onClick={()=>setMethod('Cash on Delivery')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                  <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'Cash on Delivery' ? 'bg-green-400' : ''} `}></p>
                  <p className='text-gray-500 text-sm font-medium mx-4'>Cash on Delivery</p>
              </div>

          </div>

          <div className='mt-12 bg-black text-center px-2 py-4 font-medium'>
              <button
                type='submit'
                disabled={cartData.length === 0 || submitting}
                className='w-full text-white disabled:cursor-not-allowed disabled:opacity-50'
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
          </div>
        </div>

      </div>
    </form>
  )
}

export default Placeorder
