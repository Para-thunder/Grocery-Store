// src/pages/OrdersPage.js
import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/api';
import '../styles/Orders.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        console.log("Fetched orders:", data); // helpful debug
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-container">
      <h1>Customer Orders</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.order_id} className="order-card">
            <h3>Order #{order.order_id}</h3>
            <p>Customer ID: {order.customer_id}</p>
            <p>Date: {new Date(order.order_date).toLocaleDateString()}</p>
            <p>Total: ${order.total_price}</p>
            <p>Status: {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
