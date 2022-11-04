import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CreateProjectForm from '../projects/CreateProjectForm';

const CreateProjectDialog = ({ onSubmit, onCancel, requestOnly }) => (
  <Dialog open={true} fullWidth>
    <DialogTitle>{`${requestOnly ? 'Request' : 'Create'} New Project`}</DialogTitle>
    <DialogContent>
      <CreateProjectForm onSubmit={onSubmit} onCancel={onCancel} requestOnly={requestOnly}/>
    </DialogContent>
  </Dialog>
);

CreateProjectDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreateProjectDialog;
