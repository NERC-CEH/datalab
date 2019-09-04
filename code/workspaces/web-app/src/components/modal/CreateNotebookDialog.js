import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CreateNotebookForm from '../notebooks/CreateNotebookForm';

const CreateNotebookDialog = ({ title, onSubmit, onCancel, dataStorageOptions }) => (
  <Dialog open={true} maxWidth="md">
    <div style={{ margin: 10 }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <CreateNotebookForm
            onSubmit={onSubmit}
            cancel={onCancel}
            dataStorageOptions={dataStorageOptions} />
        </DialogContent>
    </div>
  </Dialog>
);

CreateNotebookDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  dataStorageOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CreateNotebookDialog;
