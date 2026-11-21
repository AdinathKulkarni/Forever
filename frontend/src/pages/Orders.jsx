import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { AuthContext } from '../context/AuthContext'
import Title from '../components/Title'
import toast from 'react-hot-toast'
import { BACKEND_URL } from '../api'

const formatOrderDate = (date) => new Intl.DateTimeFormat('en-IN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}).format(new Date(date))

const Orders = () => {
  const { currency } = useContext(ShopContext)
  const { loginToken } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchOrders = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/order/user-orders`,
          {},
          { headers: { token: loginToken } },
        )

        if (!response.data.success || !Array.isArray(response.data.orders)) {
          throw new Error(response.data.message || 'Unable to load your orders')
        }

        if (!cancelled) setOrders(response.data.orders)
      } catch (error) {
        console.error('Unable to fetch orders:', error)
        if (!cancelled) toast.error(error.response?.data?.message || 'Unable to load your orders')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchOrders()
    return () => {
      cancelled = true
    }
  }, [loginToken])

  return (
    <main className="border-t pt-10 sm:pt-16">
      <div className="text-2xl">
        <Title text1="My" text2=" Orders" />
      </div>

      {loading ? (
        <p className="py-16 text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <section className="my-8 border border-gray-200 px-5 py-12 text-center sm:my-12 sm:px-8 sm:py-16">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
              <path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v8.5M8 5.3l8 4.6" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-800">No orders yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Once you place an order, its items and status will appear here.
          </p>
          <Link
            to="/collection"
            className="mt-6 inline-flex bg-black px-6 py-3 text-sm text-white transition-colors hover:bg-gray-800"
          >
            Continue shopping
          </Link>
        </section>
      ) : (
        <div className="my-6 flex flex-col gap-5 sm:my-8">
          {orders.map((order) => {
            const itemCount = order.items.reduce((count, item) => count + item.quantity, 0)

            return (
              <article key={order._id} className="border border-gray-200">
                <header className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="min-w-0">
                    <p className="break-all text-sm font-medium text-gray-800">
                      Order #{order._id}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Placed {formatOrderDate(order.date)} · {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <span className="inline-flex items-center gap-2 text-gray-700">
                      <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
                      {order.status}
                    </span>
                    <span className="font-medium text-gray-800">
                      {currency}{order.amount}
                    </span>
                  </div>
                </header>

                <ul className="divide-y divide-gray-100 px-4 sm:px-6">
                  {order.items.map((item) => (
                    <li
                      key={`${item.productId}-${item.size}`}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-16 shrink-0 bg-gray-100 object-cover sm:h-24 sm:w-20"
                        />
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-medium text-gray-800 sm:text-base">
                            {item.name}
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            Size: {item.size}
                            <span className="mx-2 text-gray-300" aria-hidden="true">|</span>
                            Qty: {item.quantity}
                          </p>
                          {order.paymentMethod && (
                            <p className="mt-1 text-xs text-gray-500">
                              Payment: {order.paymentMethod}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="pl-20 text-sm font-medium text-gray-700 sm:pl-0">
                        {currency}{item.price * item.quantity}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default Orders