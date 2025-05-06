import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button, Typography, Card, CardContent, Grid, Box, Divider, CircularProgress, Container, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutline, LocalOffer } from '@mui/icons-material';

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use the discounted prices for the total calculation
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setOrderPlaced(true);

    setTimeout(() => {
      clearCart();
      setTimeout(() => {
        navigate('/orders');
      }, 500);
    }, 1500);
  };

  return (
    <div className="animated-gradient-background">
      <Container className="content-container" maxWidth="md">
        <Typography variant="h3" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: 'black',
          mb: 4,
          textAlign: 'center'
        }}>
          Your Shopping Cart
        </Typography>

        {orderPlaced ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center'
          }}>
            <CheckCircleOutline sx={{ 
              fontSize: 80, 
              color: 'success.main',
              mb: 2
            }} />
            <Typography variant="h4" sx={{ mb: 2 }}>
              Order Placed Successfully!
            </Typography>
            <Typography variant="body1">
              Redirecting to your orders...
            </Typography>
            {isProcessing && <CircularProgress sx={{ mt: 3 }} />}
          </Box>
        ) : cart.length === 0 ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px'
          }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Your cart is empty
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/products')}
              sx={{ mt: 2 }}
            >
              Browse Products
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {cart.map(item => (
                <Card key={item.product_id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container alignItems="center">
                      <Grid item xs={6}>
                        <Typography variant="h6" component="div">
                          {item.name}
                          {item.isBundle && (
                            <Chip
                              icon={<LocalOffer sx={{ fontSize: 16 }} />}
                              label={`${item.bundleDiscount}% OFF`}
                              color="error"
                              size="small"
                              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Typography>
                        
                        {item.isBundle ? (
                          <Typography color="text.secondary">
                            <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>
                              ${item.originalPrice.toFixed(2)}
                            </span>
                            ${item.price.toFixed(2)} × {item.quantity}
                          </Typography>
                        ) : (
                          <Typography color="text.secondary">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="h6">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sx={{ textAlign: 'right' }}>
                        <Button
                          onClick={() => removeFromCart(item.product_id)}
                          color="error"
                          size="small"
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ position: 'sticky', top: '20px' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Order Summary
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>${totalPrice.toFixed(2)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Shipping:</Typography>
                    <Typography>$0.50</Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">${(totalPrice + 0.50).toFixed(2)}</Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handlePlaceOrder}
                    disabled={cart.length === 0}
                    sx={{ mb: 2 }}
                  >
                    Place Order
                  </Button>

                  <Button
                    onClick={clearCart}
                    color="error"
                    variant="outlined"
                    fullWidth
                    size="large"
                  >
                    Empty Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default CartPage;