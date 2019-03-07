import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  segment: {
    padding: theme.spacing.unit,
  },
});

const Segment = ({ classes, children }) => (
  <div className={classes.segment}>
    {children}
  </div>
);

export default withStyles(styles)(Segment);
