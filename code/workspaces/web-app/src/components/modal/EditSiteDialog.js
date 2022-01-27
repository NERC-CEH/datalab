import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

const EditSiteDialog = ({ title, onSubmit, onCancel, stack, formComponent: Form }) => (
  <Dialog open={true} maxWidth="md">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Form onSubmit={onSubmit} onCancel={onCancel} initialValues={stack} projectKey={stack.projectKey} />
    </DialogContent>
  </Dialog>
);

EditSiteDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  stack: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
  formComponent: PropTypes.elementType.isRequired,
};

export default EditSiteDialog;
