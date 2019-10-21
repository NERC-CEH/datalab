import React from 'react';
import { withStyles } from '@material-ui/core';
import SideBar from './SideBar';

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
  },
});

function ProjectNavigation({ children, userPermissions, classes }) {
  return (
    <div className={classes.projectNavigation}>
      <SideBar userPermissions={userPermissions} />
      <div className={classes.contentArea}>
        {children}
      </div>
    </div>
  );
}

export default withStyles(style)(ProjectNavigation);
