import axios from 'axios';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_..."); // 🔁 Replace with your publishable key

const plans = [
  { amount: 1, label: '₹1 - Trial', features: ['View Profiles Only'] },
  { amount: 10, label: '₹10 - Basic', features: ['View + Chat'] },
  { amount: 100, label: '₹100 - Premium', features: ['View + Chat + Audio Call + Video Call'] },
];

const UpgradePlan = () => {
  const { user } = useContext(AuthContext);
  const [selected, setSelected] = useState(plans[1]);
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;

      const res = await axios.post("http://localhost:5000/api/stripe/create-checkout-session", {
        userId: user._id,
        userEmail: user.email,
        amount: selected.amount,
      });

      const sessionId = res.data.id;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Stripe Checkout Error:", err);
      alert("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Upgrade to Premium</h2>

      {user?.plan === 'premium' ? (
        <div className="alert alert-success">🎉 You are already a Premium Member</div>
      ) : (
        <>
          <div className="row">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className="col-md-4 mb-3"
                onClick={() => setSelected(plan)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className={`card shadow-sm ${
                    selected.amount === plan.amount ? 'border-primary border-2' : ''
                  }`}
                >
                  <div className="card-body">
                    <h5 className="card-title">{plan.label}</h5>
                    <ul className="mb-0">
                      {plan.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary mt-3"
            onClick={handleUpgrade}
            disabled={loading}
          >
            {loading ? 'Processing Payment...' : `Pay ₹${selected.amount} and Upgrade`}
          </button>
        </>
      )}
    </div>
  );
};

export default UpgradePlan;
