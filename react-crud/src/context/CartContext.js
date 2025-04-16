import React, { createContext, useState, useContext } from 'react';

// Create a Cart Context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  // Initialize cart as an empty array
  const [cart, setCart] = useState([]);

  // Function to add product to the cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(item => item.product_id === product.product_id);
  
      console.log("Adding product to cart:", product);
      console.log("Existing cart items:", prevCart);
  
      const productQuantity = Number(product.quantity); // Ensure quantity is treated as a number
  
      if (existingProductIndex !== -1) {
        // Product already in cart, update its quantity
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + productQuantity,
        };
  
        console.log("Updated cart after adding quantity:", updatedCart);
        return updatedCart;
      } else {
        // Product not in cart, add it as new item
        const newProduct = { ...product, quantity: productQuantity };
        console.log("New product added to cart:", newProduct);
        return [...prevCart, newProduct];
      }
    });
  };
  

  // Function to remove product from the cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.product_id !== productId));
  };

  // Function to calculate total price using reduce (safely checks for an empty cart)
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const clearCart = () => {
    setCart([]); // Clear all items in the cart
  };


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, calculateTotal,clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
