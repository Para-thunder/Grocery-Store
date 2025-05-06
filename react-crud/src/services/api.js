// src/services/api.js
/*import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 10000,
});*/
// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api', // Make sure this matches your backend
  timeout: 10000,
});

// Add authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProfile = async () => {
  try {
    const response = await API.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

// ... keep your existing exports ...

export const getProducts = async () => {
  try {
    const response = await API.get('/products');
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await API.get('/categories');
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
// src/services/api.js
export const getOrders = async () => {
  try {
    const response = await API.get('/orders');
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
export const getCategoryProducts = async (categoryId) => {
  try {
    const response = await API.get(`/categories/${categoryId}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};


export const updateProfile = async (profileData) => {
  try {
    const response = await API.put('/auth/users/profile', profileData); // Changed from /auth/profile
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error.response?.data?.error || 'Failed to update profile';
  }
};
export const searchProductsByName = async (query) => {
  try {
    const response = await API.get(`/products/search?name=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error.response?.data?.error || 'Failed to search products';
  }
};
// Add these functions to your api.js file

// Filter products by price range
// Make sure your filterByPrice function in api.js looks like this:
// In your api.js file
export const filterByPrice = async (minPrice, maxPrice) => {
  try {
    const response = await fetch(`/api/products/filter-by-price?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Failed to filter products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in filterByPrice:', error);
    throw error;
  }
};
// Get a deal for 3 selected products
export const getDeal = async (productIds, discountPercentage = 20) => {
  try {
    const response = await fetch(`/api/products/deal?productIds=${productIds}&discountPercentage=${discountPercentage}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create deal');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getDeal:', error);
    throw error;
  }
};