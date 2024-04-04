import React from 'react';
// import { Link, withStyles, Button } from '@material-ui/core';
import { Link, Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import ReactMarkdown from 'react-markdown/react-markdown.min';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import ErrorOutline from '@material-ui/icons/ErrorOutline';
import PropTypes from 'prop-types';
import { extendSubdomain } from '../../core/getDomainInfo';

const styles = theme => ({
  message: {
    display: 'flex',
    margin: '15px',
    alignItems: 'center',
    backgroundColor: theme.palette.warningBackground,
    borderRadius: theme.shape.borderRadius,
  },
  text: {
    flexGrow: 1,
  },
  icon: {
    padding: '10px',
  },
  info: {
    padding: '5px',
  },
});

const SuspendWarning = ({ classes, message, docId }) => (
  <div className={classes.message}>
    <ErrorOutlineIcon className={classes.icon} />
    <div className={classes.text}>
      <ReactMarkdown>
        {message}
      </ReactMarkdown>
    </div>
    <div className={classes.info}>
      <Button color="inherit">
        <Link
          style={{ textDecoration: 'none' }}
          target="_blank"
          color="inherit"
          href={`${extendSubdomain('docs')}/howto/${docId}`}
        >
            MORE
        </Link>
      </Button>
    </div>
  </div>
);

SuspendWarning.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  docId: PropTypes.string.isRequired,
};

export default withStyles(styles)(SuspendWarning);
