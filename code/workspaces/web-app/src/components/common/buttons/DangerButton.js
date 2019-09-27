import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';

const style = theme => ({
  button: {
    borderColor: theme.palette.dangerColor,
    color: theme.palette.dangerColor,
    '&:hover': {
      backgroundColor: theme.palette.dangerBackgroundColorLight,
      color: theme.typography.dangerBackgroundColor,
    },
  },
});

const DangerButton = ({ classes, children, variant, color, ...rest }) => (
  <Button
    className={classes.button}
    variant="outlined"
    {...rest}
  >
    {children}
  </Button>
);

export default withStyles(style)(DangerButton);
