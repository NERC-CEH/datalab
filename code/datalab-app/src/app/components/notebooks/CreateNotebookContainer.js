import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Modal } from 'semantic-ui-react';
import CreateNotebookForm from './CreateNotebookForm';
import NotebookCard from './NotebookCard';
import NewNotebookButton from './NewNotebookButton';
import notebookActions from '../../actions/notebookActions';
import notify from '../common/notify';

class CreateNotebookContainer extends Component {
  constructor() {
    super();
    this.state = { open: false };
  }

  close = () => this.setState({ open: false });
  open = () => this.setState({ open: true });

  createNotebook = notebook =>
    Promise.resolve(this.close())
      .then(() => this.props.actions.createNotebook(notebook))
      .then(this.props.actions.loadNotebooks)
      .then(() => notify.success('Notebook created'))
      .catch(err => notify.error('Unable to create Notebook'));

  render() {
    const { open } = this.state;
    return (
      <div className='ui card'>
        <NewNotebookButton onClick={this.open} />
        <Modal dimmer='blurring' open={open}>
          <Modal.Header>Create a Notebook</Modal.Header>
          <Modal.Content>
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column>
                  <CreateNotebookForm onSubmit={this.createNotebook} cancel={this.close} />
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

function mapStateToProps({ form }) {
  if (form && form.createNotebook && form.createNotebook.values) {
    return { notebook: form.createNotebook.values };
  }
  return { notebook: {} };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...notebookActions,
    }, dispatch),
  };
}

export { CreateNotebookContainer as PureCreateNotebookContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(CreateNotebookContainer);
