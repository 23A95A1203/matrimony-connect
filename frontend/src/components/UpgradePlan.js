import axios from 'axios';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const plans = [
  { amount: 1, label: '₹1 - Trial', features: ['View Profiles Only'] },
  { amount: 10, label: '₹10 - Basic', features: ['View + Chat'] },
  { amount: 100, label: '₹100 - Premium', features: ['View + Chat + Audio Call + Video Call'] },
];

const UpgradePlan = () => {
  const { user } = useContext(AuthContext);
  const [selected, setSelected] = useState(plans[1]);

  const handleUpgrade = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/cashfree/create-order',
        { amount: selected.amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = res.data.payment_link;
    } catch (err) {
      alert('Payment initiation failed');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Upgrade to Premium</h2>

      {user?.plan === 'premium' ? (
        <p className="text-success">🎉 You are already a Premium Member</p>
      ) : (
        <>
          <div className="row">
            {plans.map((plan, idx) => (
              <div className="col-md-4 mb-3" key={idx}>
                <div
                  className={`card ${selected.amount === plan.amount ? 'border-primary' : ''}`}
                  onClick={() => setSelected(plan)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{plan.label}</h5>
                    <ul>
                      {plan.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary mt-3" onClick={handleUpgrade}>
            Pay ₹{selected.amount} and Upgrade
          </button>
        </>
      )}
    </div>
  );
};

export default UpgradePlan;
