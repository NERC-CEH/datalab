import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { statusTypes } from 'common';

const { getStatusKeys, getStatusProps } = statusTypes;

const styles = theme => ({
  stackStatus: {
    marginBottom: theme.spacing(1),
    padding: `${theme.spacing(0.5)}px 0`,
    borderRadius: 50, // make round
    userSelect: 'none',
  },
});

const StackStatus = ({ classes, status }) => {
  const { displayName, backgroundColor, color } = getStatusProps(status);

  return (
    <Typography
      className={classes.stackStatus}
      style={{ backgroundColor, color }}
      type="caption"
      align="center"
    >
      {displayName}
    </Typography>
  );
};

StackStatus.propTypes = {
  status: PropTypes.oneOf(getStatusKeys()),
};

export default withStyles(styles)(StackStatus);
