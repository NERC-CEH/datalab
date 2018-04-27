import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { getStatusKeys, getStatusProps } from '../../../shared/statusTypes';

function styles(theme) {
  const commonStyle = {
    maxWidth: 88,
    paddingLeft: theme.spacing.unit * 0.5,
    paddingRight: theme.spacing.unit * 0.5,
    paddingTop: theme.spacing.unit * 0.5,
    paddingBottom: theme.spacing.unit * 0.25,
  };

  return {
    text: {
      ...commonStyle,
      backgroundColor: theme.palette.secondary[800],
      color: theme.palette.grey[100],
    },
    textInvert: {
      ...commonStyle,
      backgroundColor: theme.palette.grey[100],
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
