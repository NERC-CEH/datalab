import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
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
