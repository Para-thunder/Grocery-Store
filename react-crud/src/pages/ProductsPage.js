import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
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
  Alert
} from '@mui/material';
import { useCart } from '../context/CartContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        
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
        <Grid container spacing={3}>
          {products.map(product => (
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
                  image={`/images/products/${product.name}.jpg`}
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
          ))}
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