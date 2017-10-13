import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Modal } from 'semantic-ui-react';
import CreateSiteForm from '../sites/CreateSiteForm';
import PreviewSiteCard from '../sites/PreviewSiteCard';

const CreateSiteDialog = ({ title, site, onSubmit, onCancel }) => (
  <Modal size='large' dimmer='blurring' open={true}>
    <Modal.Header>{title}</Modal.Header>
    <Modal.Content>
      <Grid divided>
        <Grid.Row>
          <Grid.Column width={10}>
            <CreateSiteForm onSubmit={onSubmit} cancel={onCancel} />
          </Grid.Column>
          <Grid.Column width={6}>
            <h2>Site Preview</h2>
            <PreviewSiteCard />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Modal.Content>
  </Modal>
);

CreateSiteDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreateSiteDialog;
