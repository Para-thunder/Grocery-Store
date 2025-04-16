import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // For getting categoryId from the URL
import { getCategoryProducts } from '../services/api'; // Correct API function name
import { Container, Typography, Card, CardMedia, CardContent, Grid, TextField, Button } from '@mui/material';
import { useCart } from '../context/CartContext'; // Assuming you have CartContext to manage the cart

const CategoryProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { categoryId } = useParams(); // Get categoryId from URL
  const { addToCart } = useCart(); // Get the addToCart function from context

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const data = await getCategoryProducts(categoryId);
        console.log("Category products data:", data); // 👈 ADD THIS
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products for category:", error);
      }
    };
    fetchCategoryProducts();
  }, [categoryId]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Products in Category {categoryId}
      </Typography>
      <Grid container spacing={3}>
        {products.length > 0 ? (
          products.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product.product_id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`/images/products/${product.product_id}.jpg`}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.jpg';
                    console.log(`Used placeholder for product`, product);
                  }}
                  style={{
                    objectFit: 'cover',
                    backgroundColor: '#f0f0f0'
                  }}
                />
                <CardContent>
                  <Typography variant="h5">{product.name || product.product_name}</Typography>
                  <Typography>${product.price}</Typography>
                  <Typography>
                    Stock: {product.stock_quantity ?? product.quantity}
                  </Typography>
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
                        max: product.stock_quantity ?? product.quantity,
                      },
                    }}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => 
                      addToCart({
                        ...product, 
                        quantity: quantities[product.product_id] || 1
                      })
                    }
                    fullWidth
                    style={{ marginTop: '0.5rem' }}
                  >
                    Add to Cart
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
    </Container>
  );
};

export default CategoryProductsPage;
