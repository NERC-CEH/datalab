import React from 'react';
import Button from '@material-ui/core/Button';

const SecondaryActionButton = ({ children, variant, color, ...rest }) => (
  <Button
    variant="outlined"
    color="secondary"
    {...rest}
  >
    {children}
  </Button>
);

export default SecondaryActionButton;
