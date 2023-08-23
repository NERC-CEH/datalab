import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import withStyles from '@mui/styles/withStyles';
import ReactMarkdown from 'react-markdown/react-markdown.min';
import Button from '@mui/material/Button';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import PropTypes from 'prop-types';
import messagesActions from '../../actions/messagesActions';

const styles = theme => ({
  message: {
    display: 'flex',
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
  button: {
    minWidth: '70px',
  },
});

const Message = ({ classes, message, allowDismiss = true }) => {
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    dispatch(messagesActions.dismissMessage(message.id));
  }, [dispatch, message]);

  return (
  <div className={classes.message}>
    <ErrorOutline className={classes.icon}/>
    <div className={classes.text}>
      <ReactMarkdown>
        {message.message}
      </ReactMarkdown>
    </div>
    {allowDismiss && <Button className={classes.button} onClick={handleClick} color={'secondary'}>Dismiss</Button>}
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
  allowDismiss: PropTypes.bool,
};

export default withStyles(styles)(Message);
