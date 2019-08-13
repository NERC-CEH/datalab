import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

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

NavBarLinkButton.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.string.isRequired,
};

export default withStyles(styles)(NavBarLinkButton);
