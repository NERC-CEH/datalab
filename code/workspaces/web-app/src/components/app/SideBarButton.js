import React from 'react';
import withStyles from '@mui/styles/withStyles';
import NavLink from './NavLink';

const styles = (theme) => {
  const coreStyle = {
    padding: `${theme.spacing(1)} ${theme.spacing(1)}`,
    margin: `${theme.spacing(0.5)} 0`,
    borderRadius: theme.shape.borderRadius,
  };

  // Order of class definitions seems important. It seems like classes get applied in
  // order from top to bottom so definitions in classes lower down will be applied after
  // those higher up. Therefore, to make activeClassName prop work as desired, its class
  // needs to be defined after the inactive class so it can override the settings in the
  // inactive class.
  return {
    inactive: {
      ...coreStyle,
      color: theme.typography.color,
      '&:hover': {
        backgroundColor: theme.palette.backgroundDarkHighTransparent,
      },
    },
    active: {
      ...coreStyle,
      color: theme.palette.highlightMono,
      background: theme.palette.backgroundDarkTransparent,
      '&:hover': {
        backgroundColor: theme.palette.backgroundDarkTransparent,
      },
    },
  };
};

const SideBarButton = ({ classes, to, label, ...rest }) => (
  <NavLink
    className={classes.inactive}
    to={to}
    label={label}
    activeClassName={classes.active}
    {...rest}/>
);

export default withStyles(styles)(SideBarButton);
