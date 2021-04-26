import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import assetLabel from '../common/form/assetLabel';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 0,
  },
}));

const EditAssetDialog = ({ onSubmit, onCancel, asset, formComponent: Form }) => {
  const classes = useStyles();
  return (
  <Dialog open={true} maxWidth="md">
    <DialogTitle>Edit Asset</DialogTitle>
    <DialogContent>
      <Typography variant="h5" className={classes.root}>{assetLabel(asset)}</Typography>
      <Form onSubmit={onSubmit} onCancel={onCancel} initialValues={asset} />
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
};

export default EditAssetDialog;
