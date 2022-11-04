import React from 'react';
import withStyles from '@mui/styles/withStyles';
import ListSubheader from '@mui/material/ListSubheader';

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
