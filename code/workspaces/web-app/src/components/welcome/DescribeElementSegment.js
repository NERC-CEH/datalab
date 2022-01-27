import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';

const styles = theme => ({
  outerDark: {
    backgroundColor: theme.palette.backgroundDarkHighTransparent,
  },
  outerLight: {
    backgroundColor: theme.palette.backgroundDarkHighTransparent,
  },
  inner: {
    margin: 'auto',
    paddingBottom: 40,
  },
});

const DescribeElementSegment = ({ classes, children, invert }) => (
  <div className={invert && classes.outerDark}>
    <div className={classes.inner}>{children}</div>
  </div>
);

DescribeElementSegment.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  invert: PropTypes.bool,
};

export default withStyles(styles)(DescribeElementSegment);
