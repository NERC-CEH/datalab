import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '../common/control/IconButton';

const Logs = ({ title, body, onCancel }) => (
  <Dialog open={true} onClose={onCancel} maxWidth="md">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText style={{ 'white-space': 'pre' }}>{body}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <IconButton onClick={onCancel} icon="clear">Cancel</IconButton>
    </DialogActions>
  </Dialog>
);

Logs.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Logs;
