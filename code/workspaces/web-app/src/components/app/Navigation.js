import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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
  pageContainer: {
    overflow: 'auto',
    width: '100%',
    height: '100%',
    display: 'flex',
  },
});

const Navigation = ({ classes, children, identity }) => (
  <div className={classes.container}>
    <div className={classes.appFrame}>
      <TopBar identity={identity} />
      <main className={classes.pageContainer}>
        {children}
      </main>
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
