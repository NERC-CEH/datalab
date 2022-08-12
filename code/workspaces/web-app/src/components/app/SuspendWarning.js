import React from 'react';
import { withStyles } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import PropTypes from 'prop-types';

const styles = theme => ({
  message: {
    display: 'flex',
    margin: '5px',
    backgroundColor: theme.palette.warningBackground,
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
  },
  text: {
    flexGrow: 1,
  },
  icon: {
    padding: '5px',
  },
});

const SuspendWarning = ({ classes, message }) => (
  <div className={classes.message}>
    <ErrorOutline className={classes.icon}/>
    <div className={classes.text}>
      <ReactMarkdown>
        {message}
      </ReactMarkdown>
    </div>
  </div>
);

SuspendWarning.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
};

export default withStyles(styles)(SuspendWarning);
