import React from 'react';
import { FaFileContract } from 'react-icons/fa';
import '../styles/Policies.css';

const PoliciesPage = () => {
  return (
    <div className="animated-background">
      <div className="policies-container">
        <h1><FaFileContract /> Shopping Policies</h1>
        
        <div className="policy-section">
          <h2>Returns & Exchanges</h2>
          <ul>
            <li>30-day return policy for unopened items</li>
            <li>Original receipt required</li>
            <li>Refunds processed within 5 business days</li>
            <li>Perishable items cannot be returned</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>Payment Methods</h2>
          <ul>
            <li>We accept Visa, Mastercard, American Express</li>
            <li>Secure PayPal payments</li>
            <li>Apple Pay and Google Pay supported</li>
            <li>Cash on delivery available</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>Shipping Policy</h2>
          <ul>
            <li>Free shipping on orders over $50</li>
            <li>2-3 business day processing time</li>
            <li>Delivery within 3-5 business days</li>
            <li>Track your order with provided tracking number</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2>Terms & Conditions</h2>
          <ul>
            <li>Prices subject to change without notice</li>
            <li>We reserve the right to limit quantities</li>
            <li>Not responsible for typographical errors</li>
            <li>By purchasing, you agree to our terms</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PoliciesPage;