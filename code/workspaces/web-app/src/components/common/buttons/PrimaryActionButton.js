import React from 'react';
import Button from '@material-ui/core/Button';

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
