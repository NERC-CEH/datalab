import React from 'react';
import Button from '@mui/material/Button';

const SecondaryActionButton = ({ children, ...rest }) => (
  <Button
    {...rest}
    variant="outlined"
    color="secondary"
  >
    {children}
  </Button>
);

export default SecondaryActionButton;
