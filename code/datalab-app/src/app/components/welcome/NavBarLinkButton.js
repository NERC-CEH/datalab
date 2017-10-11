import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

const styles = theme => ({
  linkButton: {
    height: 60,
    color: theme.palette.grey[600],
    '&:hover': {
      color: theme.palette.secondary[50],
      borderBottom: `4px solid ${theme.palette.primary[500]}`,
      paddingBottom: 7,
      borderRadius: 0,
    },
  },
});

const NavBarLinkButton = ({ classes, children, ...rest }) => (
  <Button className={classes.linkButton} {...rest}>{children}</Button>
);

export default withStyles(styles)(NavBarLinkButton);
