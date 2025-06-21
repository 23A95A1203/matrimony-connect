import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // You can call your backend to confirm payment with orderId, if needed
    console.log("Payment success for order:", orderId);
  }, [orderId]);

  return (
    <div className="container mt-5 text-center">
      <h2 className="text-success">🎉 Payment Successful!</h2>
      <p>Thank you! Your order <strong>{orderId}</strong> was successful.</p>
    </div>
  );
};

export default PaymentSuccess;
