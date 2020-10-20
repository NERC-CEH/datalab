import React from 'react';
import { withStyles } from '@material-ui/core';

const style = () => ({
  projectNavigation: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  contentArea: {
    display: 'flex',
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
});

function SideBarNavigation({ children, classes, sideBar }) {
  return (
    <div className={classes.projectNavigation}>
      { sideBar }
      <div className={classes.contentArea}>
        {children}
      </div>
    </div>
  );
}

export default withStyles(style)(SideBarNavigation);
