import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SideBar, { drawerWidth } from './SideBar';
import TopBar from './TopBar';

const topbarHeightLarge = 64;
const topbarHeightSmall = 56;
const topbarHeightXSmall = 48;

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.backgroundColor,
    width: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  appFrame: {
    backgroundColor: theme.palette.backgroundColor,
    display: 'flex',
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  content: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    '@media (min-width:1px) and (orientation: landscape)': {
      marginTop: topbarHeightXSmall,
    },
    '@media (min-width:600px)': {
      marginTop: topbarHeightLarge,
    },
    marginTop: topbarHeightSmall,
  },
});

const Navigation = ({ classes, children, identity }) => (
  <div className={classes.container}>
    <div className={classes.appFrame}>
      <TopBar identity={identity} />
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
  identity: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigation);
