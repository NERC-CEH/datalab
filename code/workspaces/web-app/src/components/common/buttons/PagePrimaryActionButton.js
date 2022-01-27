import React from 'react';
import Button from '@mui/material/Button';

const PagePrimaryActionButton = ({ children, variant, color, ...rest }) => (
  <Button
    variant="contained"
    color="primary"
    {...rest}
  >
    {children}
  </Button>
);

export default PagePrimaryActionButton;
