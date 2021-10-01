import React from 'react';
import { useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import PropTypes from 'prop-types';
import messagesActions from '../../actions/messagesActions';

const styles = theme => ({
  message: {
    display: 'flex',
    padding: '5px',
    margin: '5px',
    backgroundColor: theme.palette.messageBackground,
    color: theme.palette.message,
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

const Message = ({ classes, message }) => {
  const dispatch = useDispatch();

  return (
  <div className={classes.message}>
    <ErrorOutline className={classes.icon}/>
    <div className={classes.text}>
      {message.message}
    </div>
    <Button onClick={() => dispatch(messagesActions.dismissMessage(message.id))} color={'secondary'}>Dismiss</Button>
  </div>
  );
};

Message.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.shape({
    id: PropTypes.string,
    message: PropTypes.string.isRequired,
    expiry: PropTypes.string,
    created: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(Message);
