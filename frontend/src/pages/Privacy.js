// src/pages/Privacy.js
const Privacy = () => {
  return (
    <div className="container mt-5">
      <h2>Privacy Policy</h2>
      <p>
        We are committed to protecting your personal information. Any data you share with us will be used solely for matchmaking purposes.
      </p>
      <ul>
        <li>We do not sell or share your data with third parties.</li>
        <li>All payment information is processed securely via Stripe.</li>
        <li>You can delete your profile at any time by contacting support.</li>
      </ul>
    </div>
  );
};

export default Privacy;
