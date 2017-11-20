import React from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import CreateSiteForm from '../sites/CreateSiteForm';
import PreviewSiteCard from '../sites/PreviewSiteCard';

const CreateSiteDialog = ({ title, site, onSubmit, onCancel }) => (
  <Dialog open={true} maxWidth="md">
    <div style={{ margin: 10, display: 'flex', flexDirection: 'row' }}>
      <div>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <CreateSiteForm onSubmit={onSubmit} cancel={onCancel} />
        </DialogContent>
      </div>
      <div style={{ width: 320 }}>
        <DialogTitle>Site Preview</DialogTitle>
        <div style={{ width: '90%', margin: '0 auto' }}>
          <PreviewSiteCard />
        </div>
      </div>
    </div>
  </Dialog>
);

CreateSiteDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreateSiteDialog;
