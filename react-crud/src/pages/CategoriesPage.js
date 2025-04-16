import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/api';
import { Card, CardMedia, CardContent, Typography, Grid, CircularProgress, Container } from '@mui/material';
import { Link } from 'react-router-dom'; // ✅ Import Link

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const categoriesWithImages = data.map(category => ({
          ...category,
          imageUrl: category.imageUrl || `/images/categories/${category.category_id}.jpg`
        }));
        setCategories(categoriesWithImages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 3 }}>
        Product Categories
      </Typography>
      <Grid container spacing={3}>
        {categories.map(category => (
          <Grid item xs={12} sm={6} md={4} key={category.category_id}>
            <Link to={`/categories/${category.category_id}/products`} style={{ textDecoration: 'none' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                <CardMedia
                  component="img"
                  sx={{ height: 160, objectFit: 'cover' }}
                  image={category.imageUrl}
                  alt={category.category_name}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-category.jpg'; // Fallback image
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" color="text.primary">
                    {category.category_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {category.category_id}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoriesPage;
