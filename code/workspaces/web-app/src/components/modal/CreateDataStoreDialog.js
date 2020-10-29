import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CreateDataStoreForm from '../dataStorage/CreateDataStoreForm';
import PreviewDataStoreCard from '../dataStorage/PreviewDataStoreCard';
import { storageCreationDefaultType } from '../../config/storage';

const CreateDataStoreDialog = ({ title, dataStore, onSubmit, onCancel, projectKey }) => {
  const [defaultType, setDefaultType] = useState('');
  useEffect(() => {
    async function getDefault() {
      const defaultStorageType = await storageCreationDefaultType();
      setDefaultType(defaultStorageType);
    }
    getDefault();
  }, []);

  return (
  <Dialog open={true} maxWidth="md">
    <div style={{ margin: 10, display: 'flex', flexDirection: 'row' }}>
      <div>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <CreateDataStoreForm onSubmit={onSubmit} cancel={onCancel} projectKey={projectKey}
            initialValues={{ type: defaultType }}/>
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
};

CreateDataStoreDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  projectKey: PropTypes.string.isRequired,
};

export default CreateDataStoreDialog;
