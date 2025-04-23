// src/components/LoginToast.jsx
import React, { useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';

const LoginToast = ({ userEmail, onClose }) => {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (userEmail) {
      setOpen(true);
      const timer = setTimeout(() => {
        setOpen(false);
        onClose();
      }, 1500); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [userEmail, onClose]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="success" sx={{ width: '100%' }}>
        Welcome back, {userEmail}!
      </Alert>
    </Snackbar>
  );
};

export default LoginToast;