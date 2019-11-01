import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { statusTypes } from 'common';

const { getStatusKeys, getStatusProps } = statusTypes;

const styles = (theme) => {
  const stackStatus = {
    padding: `${theme.spacing(0.5)}px 0`,
    borderRadius: 50, // make round
    userSelect: 'none',
  };

  return ({
    stackStatus,
    stackStatusReady: {
      ...stackStatus,
      marginBottom: theme.spacing(2), // only ready has buttons under it
    },
  });
};

const StackStatus = ({ classes, status }) => {
  const { displayName, backgroundColor, color } = getStatusProps(status);

  return (
    <Typography
      className={status === 'ready' ? classes.stackStatusReady : classes.stackStatus}
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
