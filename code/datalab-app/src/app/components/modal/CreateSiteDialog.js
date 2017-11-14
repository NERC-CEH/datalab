import React from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import CreateSiteForm from '../sites/CreateSiteForm';
import PreviewSiteCard from '../sites/PreviewSiteCard';

const CreateSiteDialog = ({ title, site, onSubmit, onCancel }) => (
  <Dialog open={true} maxWidth="md">
    <div style={{ margin: 10 }}>
      <Grid container>
        <Grid item>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <CreateSiteForm onSubmit={onSubmit} cancel={onCancel} />
          </DialogContent>
        </Grid>
        <Grid item>
          <DialogTitle>Notebook Preview</DialogTitle>
          <div style={{ width: '90%', margin: '0 auto' }}>
            <PreviewSiteCard />
          </div>
        </Grid>
      </Grid>
    </div>
  </Dialog>
);

CreateSiteDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreateSiteDialog;
