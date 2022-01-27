import React from 'react';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

const styles = theme => ({
  sidebarGroup: {
    padding: `${theme.spacing(3)} 0`,
    '& + &': {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  },
  title: {
    marginLeft: theme.spacing(2),
  },
});

function SideBarGroup({ classes, children, title }) {
  // Handles case where might not have permission for anything in group.
  if (!children) return null;

  return (
    <div className={classes.sidebarGroup}>
      {title ? <Typography className={classes.title} variant='h6'>{title}</Typography> : null}
      {children}
    </div>
  );
}

export default withStyles(styles)(SideBarGroup);
