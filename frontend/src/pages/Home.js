import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Home = () => (
  <>
    <div className="home-banner text-center text-white d-flex flex-column justify-content-center align-items-center">
      <h1 className="display-4">Find Your Perfect Match ❤️</h1>
      <p className="lead">Join India's trusted matrimonial platform</p>
      <div>
        <Link to="/register" className="btn btn-primary me-2">Get Started</Link>
        <Link to="/login" className="btn btn-outline-light">Login</Link>
      </div>
    </div>
    <div className="container text-center py-5">
      <h2 className="mb-4">Why Choose Us?</h2>
      <div className="row">
        <div className="col-md-4">
          <h5>Verified Profiles</h5>
          <p>100% verified profiles with genuine information.</p>
        </div>
        <div className="col-md-4">
          <h5>Secure & Private</h5>
          <p>Your data is always safe with end-to-end protection.</p>
        </div>
        <div className="col-md-4">
          <h5>Real Matches</h5>
          <p>AI-powered matchmaking that really works.</p>
        </div>
      </div>
    </div>
    <Footer />
  </>
);

export default Home;
