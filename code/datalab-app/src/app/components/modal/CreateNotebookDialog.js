import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Modal } from 'semantic-ui-react';
import CreateNotebookForm from '../notebooks/CreateNotebookForm';
import NotebookCard from '../notebooks/NotebookCard';

const CreateNotebookDialog = ({ title, onSubmit, onCancel, notebook }) => (
    <Modal size='large' dimmer='blurring' open={true}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <Grid divided>
          <Grid.Row>
            <Grid.Column width={10}>
              <CreateNotebookForm onSubmit={onSubmit} cancel={onCancel} />
            </Grid.Column>
            <Grid.Column width={6}>
              <h2>Notebook Preview</h2>
              <NotebookCard notebook={notebook} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
    </Modal>
);

CreateNotebookDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  notebook: PropTypes.object.isRequired,
};

export default CreateNotebookDialog;
