import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/api';
import { Card, CardMedia, CardContent, Typography, Grid, CircularProgress, Container } from '@mui/material';
import { Link } from 'react-router-dom';

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

  if (loading) return (
    <div className="animated-gradient-background" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
    </div>
  );

  return (
    <div className="animated-gradient-background">
      <Container className="content-container">
        <Typography variant="h3" gutterBottom sx={{ marginBottom: 4 }}>
          Product Categories
        </Typography>
        <Grid container spacing={3}>
          {categories.map(category => (
            <Grid item xs={12} sm={6} md={4} key={category.category_id}>
              <Link to={`/categories/${category.category_id}/products`} style={{ textDecoration: 'none' }}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }}>
                  <CardMedia
                    component="img"
                    sx={{ height: 160, objectFit: 'cover' }}
                    image={category.imageUrl}
                    alt={category.category_name}
                    onError={(e) => {
                      e.target.src = '/images/placeholder-category.jpg';
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {category.category_name}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default CategoriesPage;