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

const AdapterNavLink = React.forwardRef((props, ref) => <NavLink innerRef={ref} {...props} />);
const Link = ({ classes, to, label, icon, ...rest }) => {
  // Simple li element must be wrapped with forward ref to avoid React warnings
  const LiLink = React.forwardRef(({ activeClassName, exact, ...liProps }, ref) => <li ref={ref} {...liProps} />);

  return (
    <ListItem
      className={classes.inactiveLink}
      to={to}
      component={to ? AdapterNavLink : LiLink}
      activeClassName={classes.activeLink}
      exact={true}
      button={true}
      {...rest}>
      {icon ? <ListItemIcon style={{ color: 'inherit' }}><Icon style={{ color: 'inherit' }}>{icon}</Icon></ListItemIcon> : undefined}
      {label}
     </ListItem>
  );
};

export default withStyles(styles)(Link);
