import React, { useState, useEffect } from 'react';
import { getProducts, filterByPrice } from '../services/api';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardMedia, 
  CardContent, 
  Grid, 
  CircularProgress,
  Snackbar,
  Alert,
  Slider,
  Box,
  Paper
} from '@mui/material';
import { useCart } from '../context/CartContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [maxPrice, setMaxPrice] = useState(100);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        
        // Find the maximum price to set the slider range
        const highestPrice = Math.max(...data.map(product => product.price)) + 10;
        setMaxPrice(highestPrice);
        setPriceRange([0, highestPrice]);
        
        // Initialize quantities
        const initialQuantities = {};
        data.forEach(product => {
          initialQuantities[product.product_id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching products:", error);
        setSnackbarMessage('Failed to load products');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleApplyPriceFilter = async () => {
    setLoading(true);
    try {
      const [minPrice, maxPrice] = priceRange;
      
      console.log(`Filtering products between $${minPrice} and $${maxPrice}`); // Debug log
      
      const filteredProducts = await filterByPrice(minPrice, maxPrice);
      
      if (Array.isArray(filteredProducts)) {
        setProducts(filteredProducts);
        
        // Update quantities state for new products
        const initialQuantities = {};
        filteredProducts.forEach(product => {
          initialQuantities[product.product_id] = 
            quantities[product.product_id] || 1;
        });
        setQuantities(initialQuantities);
        
        setSnackbarMessage(`Showing ${filteredProducts.length} products between $${minPrice} and $${maxPrice}`);
      } else {
        // Handle case where response isn't an array
        setSnackbarMessage('Invalid response from server when filtering products');
        console.error('Invalid response format:', filteredProducts);
      }
      
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error filtering products:", error);
      setSnackbarMessage(error.message || 'Failed to filter products');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      
      // On error, revert to original products list
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Could not restore product list:", err);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleResetFilter = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
      setPriceRange([0, maxPrice]);
      
      setSnackbarMessage('All products restored');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error resetting products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    try {
      const quantity = quantities[product.product_id] || 1;
      addToCart({
        ...product,
        quantity: Number(quantity)
      });
      
      setSnackbarMessage(`${product.name} (${quantity}) added to cart!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setSnackbarMessage(err.message || 'Failed to add to cart');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleQuantityChange = (productId, value) => {
    const product = products.find(p => p.product_id === productId);
    const newValue = Math.max(1, Math.min(product.available_quantity, value));
    
    setQuantities(prev => ({
      ...prev,
      [productId]: newValue
    }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) return (
    <div className="animated-background" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </div>
  );

  return (
    <div className="animated-background">
      <Container className="page-content">
        <Typography variant="h4" gutterBottom>Products</Typography>
        
        {/* Price Filter Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <Typography variant="h6" gutterBottom>Filter by Price</Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={maxPrice}
              valueLabelFormat={(value) => `$${value}`}
              disableSwap
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography>Price Range: ${priceRange[0]} - ${priceRange[1]}</Typography>
              <Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleApplyPriceFilter}
                  sx={{ mr: 1 }}
                >
                  Apply Filter
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleResetFilter}
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {products.length > 0 ? (
            products.map(product => (
              <Grid item xs={12} sm={6} md={4} key={product.product_id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }}>
                  <CardMedia
                    component="img"
                    sx={{ height: 200, objectFit: 'cover' }}
                    image={`/images/products/${product.product_id}.jpg`}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.jpg';
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography>${product.price}</Typography>
                    <Typography>Stock: {product.available_quantity}</Typography>
                  </CardContent>
                  <div style={{ padding: '1rem' }}>
                    <TextField
                      label="Quantity"
                      type="number"
                      value={quantities[product.product_id] || 1}
                      onChange={(e) => handleQuantityChange(
                        product.product_id, 
                        parseInt(e.target.value) || 1
                      )}
                      size="small"
                      InputProps={{
                        inputProps: {
                          min: 1,
                          max: product.available_quantity,
                        },
                      }}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.available_quantity <= 0}
                      fullWidth
                    >
                      {product.available_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <Typography variant="h6">No products found in this price range.</Typography>
                <Button variant="contained" color="primary" onClick={handleResetFilter} sx={{ mt: 2 }}>
                  Show All Products
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default ProductsPage;