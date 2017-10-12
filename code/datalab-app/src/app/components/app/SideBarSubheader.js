import React from 'react';
import { withStyles } from 'material-ui/styles';
import ListSubheader from 'material-ui/List/ListSubheader';

const styles = theme => ({
  subheader: {
    fontSize: 'larger',
    color: theme.palette.secondary[400],
  },
});

const SideBarSubheader = ({ classes, children }) => (
  <ListSubheader className={classes.subheader}>{children}</ListSubheader>
);

export default withStyles(styles)(SideBarSubheader);
