import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import makeStyles from '@mui/styles/makeStyles';
import CreateClusterForm from '../cluster/CreateClusterForm';

const useStyles = makeStyles(theme => ({
  dialogDiv: {
    margin: theme.spacing(2),
  },
}));

const CreateClusterDialog = ({ title, formName, onSubmit, onCancel, dataStorageOptions, clusterMaxWorkers, workerMaxMemory, workerMaxCpu, projectKey, condaRequired }) => {
  const classes = useStyles();
  return (
    <Dialog open={true} maxWidth="md">
      <div className={classes.dialogDiv}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <CreateClusterForm
            formName={formName}
            onSubmit={onSubmit}
            cancel={onCancel}
            clusterMaxWorkers={clusterMaxWorkers}
            workerMaxMemory={workerMaxMemory}
            workerMaxCpu={workerMaxCpu}
            dataStorageOptions={dataStorageOptions}
            initialValues={{
              maxWorkers: clusterMaxWorkers.default,
              maxWorkerMemoryGb: workerMaxMemory.default,
              maxWorkerCpu: workerMaxCpu.default,
            }}
            projectKey={projectKey}
            condaRequired={condaRequired}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
};

const inputConstraintPropTypes = PropTypes.shape({
  lowerLimit: PropTypes.number.isRequired,
  upperLimit: PropTypes.number.isRequired,
  default: PropTypes.number.isRequired,
});

CreateClusterDialog.propTypes = {
  title: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  dataStorageOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  clusterMaxWorkers: inputConstraintPropTypes.isRequired,
  workerMaxMemory: inputConstraintPropTypes.isRequired,
  workerMaxCpu: inputConstraintPropTypes.isRequired,
  projectKey: PropTypes.string.isRequired,
  condaRequired: PropTypes.bool.isRequired,
};

export default CreateClusterDialog;
