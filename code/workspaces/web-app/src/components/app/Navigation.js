import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TopBar from './TopBar';
import MessageBanner from './MessageBanner';

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
    backgroundColor: theme.palette.backgroundColor,
    overflow: 'auto',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    display: 'flex',
  },
});

const Navigation = ({ classes, children, identity, userPermissions }) => (
    <div className={classes.container}>
      <div className={classes.appFrame}>
        <TopBar identity={identity} userPermissions={userPermissions} />
        <main className={classes.pageContainer}>
          <MessageBanner/>
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
