import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import CreateNotebookForm, { FORM_NAME, TYPE_FIELD_NAME, VERSION_FIELD_NAME } from '../notebooks/CreateNotebookForm';
import { getNotebookInfo } from '../../config/images';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';
import { getTypeOptions, getVersionOptions, updateVersionOnTypeChange } from '../stacks/typeAndVersionFormUtils';

const styles = theme => ({
  dialogDiv: {
    margin: theme.spacing(2),
  },
});

const CreateNotebookDialog = ({ title, onSubmit, onCancel, dataStorageOptions, classes, projectKey }) => {
  const notebookTypeValue = useReduxFormValue(FORM_NAME, TYPE_FIELD_NAME);
  const versionOptions = getVersionOptions(getNotebookInfo(), notebookTypeValue);

  return (
    <Dialog open={true} maxWidth="md">
      <div className={classes.dialogDiv}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <CreateNotebookForm
            onSubmit={onSubmit}
            cancel={onCancel}
            dataStorageOptions={dataStorageOptions}
            projectKey={projectKey}
            typeOptions={getTypeOptions(getNotebookInfo())}
            versionOptions={versionOptions}
            onChange={updateVersionOnTypeChange(FORM_NAME, TYPE_FIELD_NAME, VERSION_FIELD_NAME, versionOptions)}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
};

CreateNotebookDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  dataStorageOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(CreateNotebookDialog);
