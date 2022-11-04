import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CreateDataStoreForm from '../dataStorage/CreateDataStoreForm';
import PreviewDataStoreCard from '../dataStorage/PreviewDataStoreCard';
import { storageCreationDefaultType } from '../../config/storage';

const CreateDataStoreDialog = ({ title, dataStore, onSubmit, onCancel, projectKey }) => (
  <Dialog open={true} maxWidth="md">
    <div style={{ margin: 10, display: 'flex', flexDirection: 'row' }}>
      <div>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <CreateDataStoreForm onSubmit={onSubmit} cancel={onCancel} projectKey={projectKey}
            initialValues={{ type: storageCreationDefaultType() }}/>
        </DialogContent>
      </div>
      <div style={{ width: 320 }}>
        <DialogTitle>Data Store Preview</DialogTitle>
        <div style={{ width: '90%', margin: '0 auto' }}>
          <PreviewDataStoreCard />
        </div>
      </div>
    </div>
  </Dialog>
);

CreateDataStoreDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  projectKey: PropTypes.string.isRequired,
};

export default CreateDataStoreDialog;
