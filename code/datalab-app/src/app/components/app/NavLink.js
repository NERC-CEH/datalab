import React from 'react';
import { withStyles } from 'material-ui/styles';
import { NavLink } from 'react-router-dom';
import { ListItem, ListItemIcon } from 'material-ui/List';
import Icon from 'material-ui/Icon';

const styles = theme => ({
  inactiveLink: {
    color: theme.palette.secondary[400],
    '&:hover': {
      color: theme.palette.secondary[600],
    },
  },
  activeLink: {
    color: theme.palette.secondary[100],
  },
});

const Link = ({ classes, to, label, icon }) => (
  <ListItem
    component={NavLink}
    className={classes.inactiveLink}
    activeClassName={classes.activeLink}
    to={to}
    button
    exact>
    {icon ? <ListItemIcon><Icon style={{ color: 'inherit' }}>{icon}</Icon></ListItemIcon> : undefined}
    {label}
   </ListItem>
);

export default withStyles(styles)(Link);
