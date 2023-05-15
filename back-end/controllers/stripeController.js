const asyncHandler = require('express-async-handler')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_PUBLISHABLE_API_KEY)

module.exports = asyncHandler(async(req, res) => {
  const params = {
    submit_type: 'pay',
    mode: 'payment',
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    shipping_options: [
      { shipping_rate: 'shr_1LETZ2IcMwC269VOpPDlZE0U' },
      { shipping_rate: 'shr_1LETbJIcMwC269VOj4btBrPV' },
    ],
    line_items: req.body.cart.map(item => {
      const img = item.image.secure_url

      return {price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [img]
        },
        unit_amount: item.price * 100
      },
      adjustable_quantity: {
        enabled: true,
        minimum: 1
      },
      quantity: item.quantity
    }
    }),
    success_url: `${req.body.successUrl}/success`,
    cancel_url: `${req.body.cancelUrl}`
  }
  
  const session = await stripe.checkout.sessions.create(params)
  res.status(200).json(session)
})