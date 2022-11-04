import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';
import { statusTypes } from 'common';

const { getStatusKeys, getStatusProps } = statusTypes;

const styles = theme => ({
  stackStatus: {
    padding: `${theme.spacing(0.5)} 0`,
    borderRadius: 50, // make round
    userSelect: 'none',
    marginBottom: theme.spacing(2),
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
