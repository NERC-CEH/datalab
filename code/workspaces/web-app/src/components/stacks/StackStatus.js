import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { statusTypes } from 'common';

const { getStatusKeys, getStatusProps } = statusTypes;

function styles(theme) {
  const commonStyle = {
    marginBottom: theme.spacing(1),
    padding: `${theme.spacing(0.5)}px 0`,
    borderRadius: theme.shape.borderRadius,
  };

  return {
    text: {
      ...commonStyle,
      color: theme.palette.grey[100],
    },
    textInvert: {
      ...commonStyle,
      color: theme.palette.secondary[800],
    },
  };
}

const StackStatus = ({ classes, status }) => {
  const { displayName, color, invertColor } = getStatusProps(status);

  return (
    <Typography
      className={invertColor ? classes.textInvert : classes.text}
      style={{ backgroundColor: color }}
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
