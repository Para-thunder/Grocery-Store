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