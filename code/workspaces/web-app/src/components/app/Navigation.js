import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SideBar from './SideBar';
import TopBar from './TopBar';

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.backgroundColor,
    width: '100%',
    height: `calc(100vh - ${theme.shape.topBarHeight}px)`,
    paddingTop: theme.shape.topBarHeight,
  },
  appFrame: {
    backgroundColor: theme.palette.backgroundColor,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  page: {
    padding: `0 ${theme.spacing(4)}px`,
    margin: '0 auto',
    width: '100%',
    maxWidth: '1000px',
    minWidth: '400px',
  },
  pageContainer: {
    overflow: 'auto',
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  contentArea: {
    display: 'flex',
    height: '100%',
  },
});

const Navigation = ({ classes, children, identity, userPermissions, projectKey }) => (
  <div className={classes.container}>
    <div className={classes.appFrame}>
      <TopBar identity={identity} />
      <div className={classes.contentArea}>
        {projectKey && (<SideBar className={classes.sideBar} userPermissions={userPermissions} projectKey={projectKey} />)}
        <div className={classes.pageContainer}>
          <main className={classes.page}>
            {children}
          </main>
        </div>
      </div>
    </div>
  </div>
);

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  identity: PropTypes.object.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  projectKey: PropTypes.string,
};

export default withStyles(styles)(Navigation);
