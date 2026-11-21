import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { assets } from '../assets/admin_assets/assets'
import { BACKEND_URL } from '../api'

const Orders = ({ token }) => {

  const currency = '₹'
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/order/list-all`,
        {},
        { headers: { token } }
      )

      if (response.data.success) {
        setOrders(response.data.orders)
        if (response.data.orders.length === 0) {
          toast('No orders found', {
            icon: '⚠️',
            style: {
              border: '1px solid #f59e0b',
              padding: '12px 16px',
              color: '#92400e',
              backgroundColor: '#fef3c7',
            },
          })
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Error while fetching all the orders')
      console.log(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
       `${BACKEND_URL}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { token } },
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Unable to update order status');
    }
  };

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className="mx-auto min-h-[70vh] w-full max-w-[1600px] px-3 py-5 sm:px-5 sm:py-7 lg:px-8">
      <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
        <h3 className="text-xl font-semibold text-gray-800 sm:text-2xl">Orders</h3>
        {orders.length > 0 && (
          <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 sm:text-sm">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </span>
        )}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="grid min-w-0 grid-cols-[48px_minmax(0,1fr)] gap-x-3 gap-y-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-x-4 sm:p-5 lg:grid-cols-[56px_minmax(0,2fr)_minmax(160px,1fr)_minmax(100px,0.65fr)_minmax(160px,1fr)] lg:items-center lg:gap-4 lg:p-5 xl:grid-cols-[64px_minmax(0,2fr)_minmax(180px,1fr)_minmax(110px,0.7fr)_minmax(180px,1fr)]"
          >
            <div className="row-span-2 flex h-12 w-12 items-center justify-center self-start rounded-lg bg-amber-50 sm:h-16 sm:w-16 lg:row-span-1 lg:h-14 lg:w-14">
              <img
                src={assets.parcel_icon}
                alt="Parcel"
                className="h-8 w-8 object-contain sm:h-10 sm:w-10"
              />
            </div>

            <div className="min-w-0 break-words text-xs leading-5 text-gray-700 sm:text-sm sm:leading-6">
              <div className="mb-2 font-medium text-gray-900 sm:mb-3">
                {order.items.map((item, index) => (
                  <span key={index}>
                    {item.name} × {item.quantity} <span className="text-gray-500">({item.size})</span>
                    {index < order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>

              <p className="font-semibold text-gray-900">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p className="mt-1">{order.address.street}</p>
              <p>
                {order.address.city}, {order.address.state}, {order.address.country} {order.address.zipCode}
              </p>
              <p className="mt-1 text-gray-600">{order.address.phone}</p>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600 sm:gap-x-5 sm:text-sm lg:col-span-1 lg:grid-cols-1 lg:gap-y-1 lg:border-l lg:border-t-0 lg:py-1 lg:pl-4">
              <p><span className="text-gray-500">Items:</span> <span className="font-medium text-gray-900">{order.items.length}</span></p>
              <p className="min-w-0 break-words"><span className="text-gray-500">Method:</span> <span className="font-medium text-gray-800">{order.paymentMethod}</span></p>
              <p><span className="text-gray-500">Payment:</span> <span className={order.paymentStatus ? 'font-medium text-green-600' : 'font-medium text-amber-600'}>{order.paymentStatus ? 'Done' : 'Pending'}</span></p>
              <p><span className="text-gray-500">Date:</span> <span className="font-medium text-gray-800">{new Date(order.date).toLocaleDateString()}</span></p>
            </div>

            <div className="col-span-2 flex items-center gap-2  border-t border-gray-100 pt-3 lg:col-span-1 lg:flex-col lg:items-start lg:justify-center lg:border-l lg:border-t-0 lg:py-1 lg:pl-4">
              <p className="text-sm text-gray-500 lg:text-sm">Total:</p>
              <p className="text-base font-semibold text-gray-900 sm:text-lg">
                {currency} {order.amount}
              </p>
            </div>

            <div className="col-span-2 border-t border-gray-100 pt-3 lg:col-span-1 lg:border-t-0 lg:pt-0">
              <label className="mb-1.5 block text-xs font-medium text-gray-500 sm:text-sm">Order status</label>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders