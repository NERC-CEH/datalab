import React from 'react';
import Button from '@mui/material/Button';
import withStyles from '@mui/styles/withStyles';

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
