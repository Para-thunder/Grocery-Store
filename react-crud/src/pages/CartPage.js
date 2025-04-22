/*CartPage.js*/
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart ,clearCart } = useCart();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false); // To track if the order was placed

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Function to handle placing the order
  const handlePlaceOrder = () => {
    // Step 1: Display confirmation message
    setOrderPlaced(true);

    // Step 2: Clear the cart (empty the cart)
    setTimeout(() => {
      cart.forEach(item => {
        removeFromCart(item.product_id); // Remove each item from the cart
      });

      // Step 3: Redirect to the orders page after 2 seconds
      setTimeout(() => {
        navigate('/orders'); // Redirect to orders page
      }, 500); // Wait a bit before redirecting
    }, 1000); // Wait for 1 second to show the confirmation message
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Cart</h2>
      {orderPlaced ? (
        <div>
          <h3>Order placed successfully!</h3>
          <p>Redirecting to the orders page...</p>
        </div>
      ) : cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item.product_id} style={{ marginBottom: '1rem' }}>
              <strong>{item.name}</strong> - ${item.price} x {item.quantity}
              <Button
                onClick={() => removeFromCart(item.product_id)}
                color="secondary"
                style={{ marginLeft: '1rem' }}
              >
                Remove
              </Button>
            </div>
          ))}
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
           

        {/* Empty Cart Button */}
        <Button
            onClick={clearCart}
            color="error"
            variant="outlined"
            style={{ marginTop: '1rem' }}
          >
            Empty Cart
          </Button>



          {/* Place Order Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlaceOrder}
            style={{ marginTop: '1rem' }}
            disabled={cart.length === 0} // Disable button if cart is empty
          >
            Place Order
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPage; 
