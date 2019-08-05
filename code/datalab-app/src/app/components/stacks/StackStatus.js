import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { getStatusKeys, getStatusProps } from '../../../shared/statusTypes';

function styles(theme) {
  const commonStyle = {
    maxWidth: 88,
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.25),
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
