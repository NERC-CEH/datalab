import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import CreateNotebookForm from '../notebooks/CreateNotebookForm';

const styles = theme => ({
  dialogDiv: {
    margin: theme.spacing(2),
  },
});

const CreateNotebookDialog = ({ title, onSubmit, onCancel, dataStorageOptions, classes }) => (
  <Dialog open={true} maxWidth="md">
    <div className={classes.dialogDiv}>
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

export default withStyles(styles)(CreateNotebookDialog);
