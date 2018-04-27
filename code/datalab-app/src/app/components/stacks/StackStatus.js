import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { getStatusKeys } from '../../../shared/statusTypes';

const styles = theme => ({
  text: {
    textTransform: 'capitalize',
    backgroundColor: theme.palette.secondary[800],
    color: theme.palette.secondary[100],
    maxWidth: 88,
    paddingTop: theme.spacing.unit * 0.5,
    paddingBottom: theme.spacing.unit * 0.5,
  },
});

const StackStatus = ({ classes, status }) => (
  <Typography className={classes.text} type="caption" align="center">
    {status}
  </Typography>
);

StackStatus.propTypes = {
  status: PropTypes.oneOf(getStatusKeys()),
};

export default withStyles(styles)(StackStatus);
