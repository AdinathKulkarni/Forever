import { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';
import { Link } from 'react-router-dom';
const Cart = () => {

  const {currency, deliveryFee,cartData, subtotal, updateQuantity } = useContext(ShopContext);

  if (cartData.length === 0) {
        return <div className="py-20 text-center text-gray-500">Your cart is empty.</div>;
    }

  return (
    <div className="my-12 flex flex-col">
      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>

      <div className="flex flex-col gap-4">
          {cartData.map((item) => (
            <div
                key={`${item._id}-${item.size}`} // Unique composite key
                className="py-4 border-t border-b grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                  {/* Product Info */}
              <div className="flex items-start gap-6">
                  <img className="w-16 sm:w-20" src={item.image[0]} alt={item.name} />
                  <div>
                      <p className="text-sm sm:text-lg font-medium">{item.name}</p>
                      <div className="flex items-center gap-5 mt-2">
                          <p>{currency}{item.price}</p>
                          <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                      </div>
                  </div>
              </div>

              {/* Quantity Input */}
              <input
                  type="number"
                  min={1}
                  step={1}
                  value={item.quantity}
                  onChange={(e) => {
                      const quantity = e.target.valueAsNumber;
                      if (Number.isInteger(quantity) && quantity > 0) {
                          updateQuantity(item._id, item.size, quantity);
                      }
                  }}
                  aria-label={`Quantity of ${item.name} (${item.size})`}
                  className="border max-w-12 sm:max-w-20 px-2 py-1"
              />

              {/* Remove Button (sets quantity to 0) */}
              <button
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                  aria-label={`Remove ${item.name} (${item.size}) from cart`}
              >
                  <img src={assets.bin_icon} className='w-5' alt="" />
              </button>
            </div>
          ))}
      </div>

      <div className='sm:flex sm:justify-end my-8 '>
        <CartTotal
          currency={currency}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
        />
      </div>

      <div className='flex justify-end'>
        <Link
          to="/place-order"
          className='bg-black text-white px-8 py-3'
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}

export default Cart