import { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets'
import { useNavigate } from 'react-router-dom'

const Placeorder = () => {

  const {currency, subtotal, deliveryFee, cartData, setCartItems} = useContext(ShopContext);
  const [method, setMethod] = useState('Cash on Delivery')

  const navigate = useNavigate();

  const placeOrder = () => {
    if (cartData.length === 0) return

    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const order = {
      id: `QCS-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Order placed',
      paymentMethod: method,
      items: cartData.map((item) => ({
        productId: item._id,
        name: item.name,
        image: item.image[0],
        price: item.price,
        size: item.size,
        quantity: item.quantity,
      })),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    }

    localStorage.setItem('orders', JSON.stringify([order, ...savedOrders]))
    setCartItems({})
    navigate('/orders')
  }

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

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
              // value={''}
              type='text'
              id='firstName'
              />

              <input 
              placeholder='Last name'
              className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md w-full'
              required
              // value={''}
              type='text'
              id='lastName'
              />
          </div>

          <input 
            placeholder='Email address'
            className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md'
            required
            // value={''}
            type='email'
            id='email'
          />

          <input 
            placeholder='Street'
            className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md'
            required
            // value={''}
            type='text'
            id='street'
          />

          <div className='flex gap-3'>
              <input 
              placeholder='City'
              className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md w-full'
              required
              // value={''}
              type='text'
              id='city'
              />

              <input 
              placeholder='State'
              className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md w-full'
              required
              // value={''}
              type='text'
              id='state'
              />
          </div>

          <div className='flex gap-3'>
              <input 
              placeholder='Zip Code'
              className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md w-full'
              required
              // value={''}
              type='text'
              id='zipCode'
              />

              <input 
              placeholder='Country'
              className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md w-full'
              required
              // value={''}
              type='text'
              id='country'
              />
          </div>

          <input 
            placeholder='Phone'
            className='border border-gray-400 px-2 py-4 focus:outline-none rounded-md'
            required
            // value={''}
            type='text'
            id='phone'
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
                onClick={placeOrder}
                disabled={cartData.length === 0}
                className='w-full text-white disabled:cursor-not-allowed disabled:opacity-50'
              >
                Place Order
              </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Placeorder