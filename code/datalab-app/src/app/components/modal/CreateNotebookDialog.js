import React from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import CreateNotebookForm from '../notebooks/CreateNotebookForm';
import PreviewNotebookCard from '../notebooks/PreviewNotebookCard';

const CreateNotebookDialog = ({ title, onSubmit, onCancel, dataStorageOptions }) => (
  <Dialog open={true} maxWidth="md">
    <div style={{ margin: 10, display: 'flex', flexDirection: 'row' }}>
      <div>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <CreateNotebookForm
            onSubmit={onSubmit}
            cancel={onCancel}
            dataStorageOptions={dataStorageOptions} />
        </DialogContent>
      </div>
      <div style={{ width: 320 }}>
        <DialogTitle>Notebook Preview</DialogTitle>
        <div style={{ width: '90%', margin: '0 auto' }}>
          <PreviewNotebookCard />
        </div>
      </div>
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
