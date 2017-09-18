import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Modal } from 'semantic-ui-react';
import CreateNotebookForm from './CreateNotebookForm';
import NotebookCard from './NotebookCard';
import NewNotebookButton from './NewNotebookButton';
import notebookActions from '../../actions/notebookActions';
import modalDialogActions from '../../actions/modalDialogActions';
import notify from '../common/notify';

class CreateNotebookContainer extends Component {
  createNotebook = notebook =>
    Promise.resolve(this.props.actions.closeModalDialog())
      .then(() => this.props.actions.createNotebook(notebook))
      .then(this.props.actions.loadNotebooks)
      .then(() => notify.success('Notebook created'))
      .catch(err => notify.error('Unable to create Notebook'));

  render() {
    return (
      <div className='ui card'>
        <NewNotebookButton onClick={this.props.actions.openModalDialog} />
        <Modal dimmer='blurring' open={this.props.dialogOpen}>
          <Modal.Header>Create a Notebook</Modal.Header>
          <Modal.Content>
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column>
                  <CreateNotebookForm onSubmit={this.createNotebook} cancel={this.props.actions.closeModalDialog} />
                </Grid.Column>
                <Grid.Column>
                  <h2>Notebook Preview</h2>
                  <NotebookCard notebook={this.props.notebook} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ form, modalDialog }) {
  let notebook = {};

  if (form && form.createNotebook && form.createNotebook.values) {
    notebook = form.createNotebook.values;
  }
  return {
    notebook,
    dialogOpen: modalDialog.open,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...notebookActions,
      ...modalDialogActions,
    }, dispatch),
  };
}

export { CreateNotebookContainer as PureCreateNotebookContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(CreateNotebookContainer);
