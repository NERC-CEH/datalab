import React from 'react';
import withStyles from '@mui/styles/withStyles';

const styles = theme => ({
  segment: {
    padding: theme.spacing(1),
  },
});

const Segment = ({ classes, children }) => (
  <div className={classes.segment}>
    {children}
  </div>
);

export default withStyles(styles)(Segment);
