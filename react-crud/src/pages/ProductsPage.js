import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import { Container, Typography, TextField, Button, Card, CardMedia, CardContent, Grid } from '@mui/material'; // Use Grid for the layout
import { useCart } from '../context/CartContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <Container className="products-container">
      <Typography variant="h4" gutterBottom>Products</Typography>
      <Grid container spacing={3}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.product_id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                sx={{ height: 200, objectFit: 'cover' }}
                image={`/images/products/${product.product_id}.jpg`}
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/images/placeholder-product.jpg'; // Fallback image
                }}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography>${product.price}</Typography>
                <Typography>Stock: {product.available_quantity}</Typography>
              </CardContent>
              <div className="product-actions">
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
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    addToCart({ ...product, quantity: quantities[product.product_id] || 1 })
                  }
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductsPage;
