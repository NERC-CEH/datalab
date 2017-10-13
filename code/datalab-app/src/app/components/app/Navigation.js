import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SideBar from './SideBar';
import TopBar from './TopBar';

const topbarHeight = 64;

const styles = theme => ({
  container: {
    width: '100%',
  },
  appFrame: {
    position: 'absolute',
    display: 'flex',
    height: '100%',
    width: '100%',
    zIndex: 1,
  },
  content: {
    width: '100%',
    height: `calc(100% - ${topbarHeight}px)`,
    marginTop: topbarHeight,
  },
});

const Navigation = ({ classes, children }) => (
  <div className={classes.container}>
    <div className={classes.appFrame}>
      <TopBar/>
      <SideBar/>
      <main className={classes.content}>
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
};

export default withStyles(styles)(Navigation);
