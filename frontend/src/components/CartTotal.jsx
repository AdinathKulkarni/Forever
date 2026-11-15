import Title from './Title'

const CartTotal = ({ currency, subtotal, deliveryFee }) => {
  const total = subtotal + deliveryFee

  return (
    <section className="w-full sm:max-w-sm" aria-label="Order summary">
      <div className="text-2xl mb-3">
        <Title text1={'Cart'} text2=" Total" />
      </div>

      <dl className="flex flex-col gap-4 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{currency}{subtotal}</dd>
        </div>

        <div className="flex justify-between">
          <dt>Shipping Fee</dt>
          <dd>{currency}{deliveryFee}</dd>
        </div>

        <div className="flex justify-between border-t pt-4 font-semibold">
          <dt>Total</dt>
          <dd>{currency}{total}</dd>
        </div>
      </dl>
    </section>
  )
}

export default CartTotal
