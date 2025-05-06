import React, { useState, useEffect } from 'react';
import { getProducts, getDeal } from '../services/api';
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardMedia, 
  CardContent, 
  Grid, 
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip
} from '@mui/material';
import { LocalOffer } from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const DealsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dealLoading, setDealLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
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

  const handleSelectProduct = (event, index) => {
    const productId = event.target.value;
    const updatedSelection = [...selectedProducts];
    updatedSelection[index] = productId;
    setSelectedProducts(updatedSelection);
  };

  const handleGetDeal = async () => {
    if (selectedProducts.length !== 3) {
      setSnackbarMessage('Please select exactly 3 products');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    
    setDealLoading(true);
    try {
      const productIds = selectedProducts.join(',');
      const dealData = await getDeal(productIds);
      setCurrentDeal(dealData);
      
      setSnackbarMessage('Deal successfully created!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error creating deal:", error);
      setSnackbarMessage('Failed to create deal');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setDealLoading(false);
    }
  };

  /*const handleAddDealToCart = () => {
    try {
      // Add each product in the deal to the cart
      currentDeal.products.forEach(product => {
        addToCart({
          ...product,
          quantity: 1
        });
      });
      
      setSnackbarMessage('Deal added to cart!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error adding deal to cart:", err);
      setSnackbarMessage(err.message || 'Failed to add deal to cart');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };*/

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) return (
    <div className="animated-background" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </div>
  );
  const handleAddDealToCart = () => {
    try {
      // Calculate the discount percentage per product
      const originalTotal = parseFloat(currentDeal.totalPrice);
      const discountedTotal = parseFloat(currentDeal.discountedPrice);
      const discountRatio = discountedTotal / originalTotal;
      
      // Add each product with the adjusted price to maintain the discount
      currentDeal.products.forEach(product => {
        const discountedPrice = (product.price * discountRatio).toFixed(2);
        
        addToCart({
          ...product,
          // Add original price for reference
          originalPrice: product.price,
          // Override the price with the discounted price
          price: parseFloat(discountedPrice),
          // Add a flag to indicate this is part of a bundle
          isBundle: true,
          bundleId: Date.now(), // Generate a unique bundle ID to group items
          bundleDiscount: currentDeal.discountPercentage,
          quantity: 1
        });
      });
      
      setSnackbarMessage('Bundle added to cart with discount applied!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error adding deal to cart:", err);
      setSnackbarMessage(err.message || 'Failed to add deal to cart');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="animated-background">
      <Container className="page-content">
        <Typography variant="h4" gutterBottom>
          <LocalOffer sx={{ mr: 1, verticalAlign: 'middle' }} />
          Special Deals
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <Typography variant="h6" gutterBottom>Create Your Own Bundle Deal</Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Select any 3 products and get 20% off the total price!
          </Typography>
          
          <Grid container spacing={2}>
            {[0, 1, 2].map((index) => (
              <Grid item xs={12} md={4} key={index}>
                <FormControl fullWidth>
                  <InputLabel>Product {index + 1}</InputLabel>
                  <Select
                    value={selectedProducts[index] || ''}
                    onChange={(e) => handleSelectProduct(e, index)}
                    label={`Product ${index + 1}`}
                  >
                    {products.map(product => (
                      <MenuItem key={product.product_id} value={product.product_id}>
                        {product.name} - ${product.price}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleGetDeal}
              disabled={selectedProducts.length !== 3 || dealLoading}
            >
              {dealLoading ? <CircularProgress size={24} /> : 'Get Deal Price'}
            </Button>
          </Box>
        </Paper>
        
        {currentDeal && (
          <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Your Custom Bundle</Typography>
              <Chip 
                label={`${currentDeal.discountPercentage}% OFF`} 
                color="error" 
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            
            <Grid container spacing={3}>
              {currentDeal.products.map(product => (
                <Grid item xs={12} md={4} key={product.product_id}>
                  <Card>
                    <CardMedia
                      component="img"
                      sx={{ height: 140, objectFit: 'cover' }}
                      image={`/images/products/${product.name}.jpg`}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/images/placeholder-product.jpg';
                      }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1">{product.name}</Typography>
                      <Typography variant="body2" color="textSecondary">${product.price}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Grid container>
                <Grid item xs={12} md={7}>
                  <Typography variant="body1">Original Total: <span style={{ textDecoration: 'line-through' }}>${currentDeal.totalPrice}</span></Typography>
                  <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                    Bundle Price: ${currentDeal.discountedPrice}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    You save: ${(currentDeal.totalPrice - currentDeal.discountedPrice).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mt: { xs: 2, md: 0 } }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={handleAddDealToCart}
                  >
                    Add Bundle to Cart
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}

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

export default DealsPage;