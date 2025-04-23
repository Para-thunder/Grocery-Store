/* import React, { useState, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          setError('');
          console.log("Loaded from localStorage:", parsedUser);
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
        console.log("Fetched from API:", data);

        setUserData(data);
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

          {userData ? (
            <>
              <Typography variant="h3" gutterBottom sx={{ 
                fontWeight: 'bold',
                color: 'purple',
                mb: 4
              }}>
                My Profile
              </Typography>
              
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
 */

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
  Divider
} from '@mui/material';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          setError('');
          console.log("Loaded from localStorage:", parsedUser);
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
        console.log("Fetched from API:", data);

        setUserData(data);
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

          {userData ? (
            <>
              <Typography variant="h3" gutterBottom sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 4
              }}>
                My Profile
              </Typography>
              
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