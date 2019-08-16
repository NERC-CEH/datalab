import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SideBar, { drawerWidth } from './SideBar';
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
    width: `calc(100% - ${drawerWidth}px)`,
    maxWidth: '750px',
    padding: theme.spacing(2),
    margin: '0 auto',
  },
  contentArea: {
    display: 'flex',
    height: '100%',
  },
});

const Navigation = ({ classes, children, identity, userPermissions }) => (
  <div className={classes.container}>
    <div className={classes.appFrame}>
      <TopBar identity={identity} />
      <div className={classes.contentArea}>
        <SideBar className={classes.sideBar} userPermissions={userPermissions} />
        <main className={classes.page}>
          {children}
        </main>
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
};

export default withStyles(styles)(Navigation);
