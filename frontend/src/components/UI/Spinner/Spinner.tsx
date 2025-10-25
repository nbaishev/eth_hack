import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Spinner: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
      <CircularProgress sx={{ color: '#555' }} />
    </Box>
  );
};

export default Spinner;
