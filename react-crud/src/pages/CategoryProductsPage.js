import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  CircularProgress,
  Snackbar,
  Alert,
  TextField
} from '@mui/material';
import { useCart } from '../context/CartContext';

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/categories/${categoryId}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products || []);
        
        // Initialize quantities
        const initialQuantities = {};
        data.products?.forEach(product => {
          initialQuantities[product.product_id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const handleAddToCart = (product) => {
    try {
      const quantity = quantities[product.product_id] || 1;
      addToCart({
        ...product,
        quantity: Number(quantity) // Ensure it's a number
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
    // Ensure value is within 1 and available stock
    const product = products.find(p => p.product_id === productId);
    const newValue = Math.max(1, Math.min(product.stock_quantity, value));
    
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

  if (error) return (
    <Container>
      <Typography color="error">{error}</Typography>
    </Container>
  );

  return (
    <div className="animated-background">
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Products in Category {categoryId}
        </Typography>
        
        <Grid container spacing={3}>
          {products.length > 0 ? (
            products.map((product) => (
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
                    <Typography>Stock: {product.stock_quantity}</Typography>
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
                          max: product.stock_quantity,
                        },
                      }}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock_quantity <= 0}
                      fullWidth
                    >
                      {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No products available in this category.
            </Typography>
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

export default CategoryProductsPage;