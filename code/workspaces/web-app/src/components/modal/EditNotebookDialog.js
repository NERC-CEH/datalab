import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

const EditNotebookDialog = ({ title, onSubmit, onCancel, stack, formComponent: Form }) => (
  <Dialog open={true} maxWidth="md">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Form onSubmit={onSubmit} onCancel={onCancel} initialValues={stack} />
    </DialogContent>
  </Dialog>
);

EditNotebookDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  stack: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    assets: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  formComponent: PropTypes.elementType.isRequired,
};

export default EditNotebookDialog;
