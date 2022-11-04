import React from 'react';
import Button from '@mui/material/Button';

const PrimaryActionButton = ({ children, ...rest }) => (
  <Button
    {...rest}
    variant="outlined"
    color="primary"
  >
    {children}
  </Button>
);

export default PrimaryActionButton;
