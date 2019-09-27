import React from 'react';
import Button from '@material-ui/core/Button';

const PrimaryActionButton = ({ children, variant, color, ...rest }) => (
  <Button
    variant="outlined"
    color="primary"
    {...rest}
  >
    {children}
  </Button>
);

export default PrimaryActionButton;
