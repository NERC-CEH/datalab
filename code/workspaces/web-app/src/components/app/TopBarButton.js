import React from 'react';
import { withStyles } from '@material-ui/core';
import NavLink from './NavLink';

const styles = (theme) => {
  const coreStyle = {
    borderRadius: theme.shape.borderRadius,
    padding: `0 ${theme.spacing(2)}px`,
    margin: `0 ${theme.spacing(0.5)}px`,
    height: theme.shape.topBarContentHeight,
    width: 'auto',
  };

  // Order of class definitions seems important. It seems like classes get applied in
  // order from top to bottom so definitions in classes lower down will be applied after
  // those higher up. Therefore, to make activeClassName prop work as desired, its class
  // needs to be defined after the inactive class so it can override the settings in the
  // inactive class.
  return {
    inactive: {
      ...coreStyle,
      color: theme.palette.highlightMono,
      '&:hover': {
        background: theme.palette.highlightMonoTransparent,
      },
    },
    active: {
      color: theme.typography.color,
      background: theme.palette.highlightMono,
      '&:hover': {
        background: theme.palette.highlightMono,
      },
    },
  };
};

const TopBarButton = ({ classes, to, label, ...rest }) => (
  <NavLink
    className={classes.inactive}
    to={to}
    label={label}
    activeClassName={classes.active}
    {...rest}/>
);

export default withStyles(styles)(TopBarButton);
