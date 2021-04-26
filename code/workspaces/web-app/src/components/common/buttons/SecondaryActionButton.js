import React from 'react';
import Button from '@material-ui/core/Button';

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
