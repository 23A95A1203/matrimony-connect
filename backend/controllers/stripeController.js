// backend/controllers/stripeController.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  const { userId, userEmail, amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Matrimony Premium Membership",
            },
            unit_amount: amount * 100, // convert ₹ to paise
          },
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/upgrade-plan`,
      metadata: { userId, amount },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    res.status(500).json({ error: "Payment initiation failed" });
  }
};
