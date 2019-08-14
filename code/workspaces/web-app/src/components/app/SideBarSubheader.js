import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';

const styles = theme => ({
  subheader: {
    fontSize: 'larger',
    color: theme.palette.secondary[400],
  },
});

const SideBarSubheader = ({ classes, children }) => (
  <ListSubheader className={classes.subheader} disableSticky>{children}</ListSubheader>
);

export default withStyles(styles)(SideBarSubheader);
