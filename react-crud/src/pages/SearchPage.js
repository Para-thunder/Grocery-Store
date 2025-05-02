import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import InputAdornment from '@mui/material/InputAdornment';

import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Box
} from '@mui/material';
import { searchProductsByName } from '../services/api';
import '../styles/SearchPage.css';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get search query from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';
    setSearchQuery(query);
    
    if (query) {
      fetchSearchResults(query);
    } else {
      setLoading(false);
      setProducts([]);
    }
  }, [location.search]);

  const fetchSearchResults = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const results = await searchProductsByName(query);
      setProducts(results);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          sx={{ mt: 2 }}
          disabled={!searchQuery.trim()}
        >
          Search
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && products.length === 0 && searchQuery && (
        <Typography variant="h5" align="center" sx={{ my: 4 }}>
          No products found for "{searchQuery}"
        </Typography>
      )}

      {!loading && products.length > 0 && (
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            Search Results for "{searchQuery}"
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Found {products.length} {products.length === 1 ? 'product' : 'products'}
          </Typography>

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.product_id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    sx={{ height: 200, objectFit: 'contain', pt: 2 }}
                    image={`/images/products/${product.product_id}.jpg`}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.jpg';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6">
                      {product.name}
                    </Typography>
                    <Typography color="textSecondary">
                      {product.category_name}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      ${product.price}
                    </Typography>
                    <Typography variant="body2" color={product.available_quantity > 0 ? 'success.main' : 'error'}>
                      {product.available_quantity > 0 
                        ? `${product.available_quantity} in stock` 
                        : 'Out of stock'}
                    </Typography>
                  </CardContent>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ m: 2 }}
                    onClick={() => navigate(`/products/${product.product_id}`)}
                  >
                    View Details
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default SearchPage;