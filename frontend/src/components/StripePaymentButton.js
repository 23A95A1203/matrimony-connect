// src/components/StripePaymentButton.js
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../context/AuthContext"; // adjust if needed
import axios from "axios";

const stripePromise = loadStripe("pk_test_..."); // Replace with your publishable key

const StripePaymentButton = () => {
  const { user } = useAuth();

  const handleClick = async () => {
    const stripe = await stripePromise;

    const res = await axios.post("/api/stripe/create-checkout-session", {
      userId: user._id,
      userEmail: user.email,
    });

    await stripe.redirectToCheckout({ sessionId: res.data.id });
  };

  return (
    <button onClick={handleClick} className="bg-green-600 text-white px-4 py-2 rounded">
      Upgrade to Premium – ₹199
    </button>
  );
};

export default StripePaymentButton;
