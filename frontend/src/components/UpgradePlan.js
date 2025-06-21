// src/pages/UpgradePlan.js
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
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const txnid = "Txn" + Date.now();
      const data = {
        amount: selected.amount,
        productinfo: "MatrimonyConnect Premium",
        firstname: user.name?.split(' ')[0] || 'User',
        email: user.email,
        phone: user.phone || "9999999999",
        txnid,
      };

      const res = await axios.post('http://localhost:5000/api/payment/payu-hash', data);
      const { hash } = res.data;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://test.payu.in/_payment";

      const fields = {
        key: "gtKFFx",
        txnid,
        amount: data.amount,
        productinfo: data.productinfo,
        firstname: data.firstname,
        email: data.email,
        phone: data.phone,
        surl: "http://localhost:3000/payment-success",
        furl: "http://localhost:3000/payment-failure",
        hash,
        service_provider: "payu_paisa",
        udf1: "", udf2: "", udf3: "", udf4: "", udf5: "",
        udf6: "", udf7: "", udf8: "", udf9: "", udf10: ""
      };

      for (const key in fields) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("PayU Payment Error:", err);
      alert("Payment initiation failed.");
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
                  className={`card shadow-sm ${selected.amount === plan.amount ? 'border-primary border-2' : ''}`}
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
