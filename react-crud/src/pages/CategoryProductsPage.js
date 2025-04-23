import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CircularProgress } from '@mui/material';

const CategoryProductsPage = () => {
  const { category_id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/categories/${category_id}/products`);
        const data = await response.json();
        setProducts(data.products || []);
        setCategoryName(data.categoryName || `Category ${category_id}`);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category_id]);

  if (loading) return (
    <div className="animated-gradient-background" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
    </div>
  );

  return (
    <div className="animated-gradient-background">
      <Container className="content-container">
        <Typography variant="h3" gutterBottom sx={{ marginBottom: 4 }}>
          Products in {categoryName}
        </Typography>
        <Grid container spacing={3}>
          {products.map((product) => (
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
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography color="text.secondary">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Typography color="text.secondary">
                    Stock: {product.available_quantity}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default CategoryProductsPage;