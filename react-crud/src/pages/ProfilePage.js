import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  CircularProgress, 
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { updateProfile } from '../services/api';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          setFormData({
            name: parsedUser.name || '',
            email: parsedUser.email || '',
            address: parsedUser.address || '',
            password: '',
            confirmPassword: ''
          });
          setError('');
        }

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:4000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          address: data.address || '',
          password: '',
          confirmPassword: ''
        });
        localStorage.setItem('user', JSON.stringify(data));
        setError('');
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      console.log('Attempting profile update...');
      
      if (formData.password && formData.password !== formData.confirmPassword) {
        setUpdateError('Passwords do not match');
        return;
      }
  
      const updateData = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        ...(formData.password && { password: formData.password })
      };
  
      console.log('Prepared update data:', updateData);
  
      const response = await updateProfile(updateData);
      console.log('Full response:', response); // Log full response
      
      if (!response || !response.customer) {
        throw new Error(response?.message || 'Invalid response from server');
      }
  
      setUserData(response.customer);
      localStorage.setItem('user', JSON.stringify(response.customer));
      
      setUpdateSuccess(true);
      setEditMode(false);
      setUpdateError(''); // Clear any previous errors
    } catch (err) {
      console.error('Update failed:', err);
      setUpdateError(
        err.message || 
        err.response?.data?.error || 
        'Failed to update profile. Please try again.'
      );
      setUpdateSuccess(false);
    }
  };

  if (loading) {
    return (
      <div className="animated-gradient-background">
        <Container maxWidth="md" sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '80vh'
        }}>
          <CircularProgress size={60} />
        </Container>
      </div>
    );
  }

  return (
    <div className="animated-gradient-background">
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ 
          p: 4, 
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}>

          {error && !userData && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error} - Please <a href="/login" style={{color: 'inherit'}}>login again</a>
            </Alert>
          )}

          {updateSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Profile updated successfully!
            </Alert>
          )}

          {updateError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {updateError}
            </Alert>
          )}

          {userData ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}>
                  My Profile
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleEditClick}
                  disabled={editMode}
                >
                  Edit Profile
                </Button>
              </Box>
              
              {editMode ? (
                <Dialog open={editMode} onClose={() => setEditMode(false)}>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogContent>
                    <TextField
                      margin="dense"
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      margin="dense"
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      margin="dense"
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      margin="dense"
                      label="New Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 2 }}
                      placeholder="Leave blank to keep current password"
                    />
                    <TextField
                      margin="dense"
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button onClick={handleUpdateProfile} variant="contained">Save</Button>
                  </DialogActions>
                </Dialog>
              ) : (
                <List sx={{ width: '100%' }}>
                  <ListItem>
                    <ListItemText 
                      primary="Name" 
                      secondary={userData.name || 'Not provided'} 
                      secondaryTypographyProps={{ variant: 'h6' }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Email" 
                      secondary={userData.email || 'Not provided'} 
                      secondaryTypographyProps={{ variant: 'h6' }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Address" 
                      secondary={userData.address || 'Not provided'} 
                      secondaryTypographyProps={{ variant: 'h6' }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Member Since" 
                      secondary={userData.createdAt 
                        ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          }) 
                        : 'Not available'}
                      secondaryTypographyProps={{ variant: 'h6' }}
                    />
                  </ListItem>
                </List>
              )}

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                gap: 2,
                mt: 4
              }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/')}
                  size="large"
                >
                  Back to Home
                </Button>
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={handleLogout}
                  size="large"
                >
                  Logout
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              p: 4
            }}>
              <Typography variant="h4" gutterBottom>
                No Active Session
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Please log in to view your profile details
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/login')}
                size="large"
                sx={{ width: '200px' }}
              >
                Go to Login
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default ProfilePage;