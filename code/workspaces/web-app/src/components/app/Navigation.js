import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles, useTheme } from '@material-ui/core/styles';
import TopBar from './TopBar';
import MessageBanner from './MessageBanner';

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.backgroundColor,
    width: '100%',
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
    display: 'flex',
  },
});

const Navigation = ({ classes, children, identity, userPermissions }) => {
  const messageCount = useSelector(s => s.messages.value).length;
  const theme = useTheme();
  const messagesHeight = messageCount * theme.shape.messageHeight;
  const heightDiff = theme.shape.topBarHeight + messagesHeight;

  return (
    <div className={classes.container} style={{ height: `calc(100vh - ${heightDiff}px)` }}>
      <div className={classes.appFrame}>
        <TopBar identity={identity} userPermissions={userPermissions} />
        <main className={classes.pageContainer} style={{ height: `calc(100% + ${messagesHeight}px)` }}>
          <MessageBanner/>
          {children}
        </main>
      </div>
    </div>
  );
};

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
