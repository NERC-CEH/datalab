import React from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogTitle, DialogContent, DialogActions, DialogContentText } from 'material-ui/Dialog';

const DatalabModal = ({ title, body, children }) => (
    <Dialog open={true} maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
      </DialogContent>
      <DialogActions>{children}</DialogActions>
    </Dialog>
);

DatalabModal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
};

export default DatalabModal;
