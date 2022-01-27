import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import assetLabel from '../common/form/assetLabel';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 0,
  },
}));

const EditAssetDialog = ({ onSubmit, onCancel, asset, formComponent: Form, editPermissions }) => {
  const classes = useStyles();
  return (
  <Dialog open={true} maxWidth="md">
    <DialogTitle>Edit Asset</DialogTitle>
    <DialogContent>
      <Typography variant="h5" className={classes.root}>{assetLabel(asset)}</Typography>
      <Form onSubmit={onSubmit} onCancel={onCancel} initialValues={asset} editPermissions={editPermissions} />
    </DialogContent>
  </Dialog>
  );
};

EditAssetDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  asset: PropTypes.shape({
    owners: PropTypes.arrayOf(PropTypes.object).isRequired,
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
    visible: PropTypes.string.isRequired,
  }),
  formComponent: PropTypes.elementType.isRequired,
  editPermissions: PropTypes.object.isRequired,
};

export default EditAssetDialog;
