import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-dark text-light text-center py-4 mt-5">
    <p>
      <a href="/terms" className="text-light">Terms & Conditions</a> | 
      <a href="/privacy" className="text-light mx-2">Privacy Policy</a> | 
      <a href="/pricing" className="text-light">Pricing</a>
    </p>
    <div className="d-flex justify-content-center mt-2 gap-3">
      <a href="https://facebook.com" className="text-light"><FaFacebook size={20} /></a>
      <a href="https://twitter.com" className="text-light"><FaTwitter size={20} /></a>
      <a href="https://instagram.com" className="text-light"><FaInstagram size={20} /></a>
    </div>
    <p className="mt-3">&copy; 2025 Matrimony Connect. All rights reserved.</p>
  </footer>
);

export default Footer;