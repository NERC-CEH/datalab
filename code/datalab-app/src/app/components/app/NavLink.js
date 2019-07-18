import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';

const coreStyle = {
  padding: '16px 40px 16px 40px',
};

const styles = theme => ({
  inactiveLink: {
    ...coreStyle,
    color: theme.palette.secondary[400],
    '&:hover': {
      color: theme.palette.secondary[600],
      backgroundColor: theme.palette.grey[100],
    },
  },
  activeLink: {
    ...coreStyle,
    color: theme.palette.secondary[100],
  },
});

const Link = ({ classes, to, label, icon, ...rest }) => (
  <ListItem
    className={classes.inactiveLink}
    to={to}
    component={to ? NavLink : ({ activeClassName, exact, ...liProps }) => <li {...liProps} />}
    activeClassName={classes.activeLink}
    exact
    button
    {...rest}>
    {icon ? <ListItemIcon><Icon style={{ color: 'inherit' }}>{icon}</Icon></ListItemIcon> : undefined}
    {label}
   </ListItem>
);

export default withStyles(styles)(Link);
