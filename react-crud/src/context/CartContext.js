import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const loadCartFromLocalStorage = (email) => {
  const cartData = localStorage.getItem(`cart_${email}`);
  return cartData ? JSON.parse(cartData) : [];
};

const saveCartToLocalStorage = (email, cart) => {
  localStorage.setItem(`cart_${email}`, JSON.stringify(cart));
};

export const CartProvider = ({ children, email }) => {
  const [cart, setCart] = useState(() => loadCartFromLocalStorage(email));

  useEffect(() => {
    if (email) {
      saveCartToLocalStorage(email, cart);
    }
  }, [cart, email]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(item => item.product_id === product.product_id);
      const productQuantity = Number(product.quantity);

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + productQuantity,
        };
        return updatedCart;
      } else {
        const newProduct = { ...product, quantity: productQuantity };
        return [...prevCart, newProduct];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.product_id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, calculateTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
