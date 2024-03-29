import React from 'react';
import withStyles from '@mui/styles/withStyles';
import { NavLink } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Icon from '@mui/material/Icon';

const styles = theme => ({
  listIcon: {
    color: 'inherit',
    minWidth: '24px', // standard size of MUI icons - overrides default value
    paddingRight: theme.spacing(2),
  },
});

const AdapterNavLink = React.forwardRef((props, ref) => <NavLink innerRef={ref} {...props} />);
const Link = ({ classes, to, label, icon, ...rest }) => {
  // Simple li element must be wrapped with forward ref to avoid React warnings
  const LiLink = React.forwardRef(({ activeClassName, exact, ...liProps }, ref) => <li ref={ref} {...liProps} />);

  return (
    <ListItem
      to={to}
      component={to ? AdapterNavLink : LiLink}
      button={true}
      {...rest}>
      {icon ? <ListItemIcon className={classes.listIcon}><Icon style={{ color: 'inherit' }}>{icon}</Icon></ListItemIcon> : undefined}
      {label}
     </ListItem>
  );
};

export default withStyles(styles)(Link);
