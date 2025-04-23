import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import { Container, Typography, TextField, Button, Card, CardMedia, CardContent, Grid, CircularProgress } from '@mui/material';
import { useCart } from '../context/CartContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' ,backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
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
                    onChange={(e) => {
                      setQuantities({
                        ...quantities,
                        [product.product_id]: e.target.value,
                      });
                    }}
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
                    onClick={() =>
                      addToCart({ ...product, quantity: quantities[product.product_id] || 1 })
                    }
                    fullWidth
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default ProductsPage;