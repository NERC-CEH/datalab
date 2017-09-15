import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid } from 'semantic-ui-react';
import CreateNotebookForm from './CreateNotebookForm';
import NotebookCard from './NotebookCard';
import notebookActions from '../../actions/notebookActions';
import notify from '../common/notify';

class CreateNotebookContainer extends Component {
  createNotebook = (notebook) => {
    console.log(notebook);
    return this.props.actions.createNotebook(notebook)
      .then(this.props.actions.loadNotebooks)
      .then(() => notify.success('Notebook created'))
      .catch(err => notify.error('Unable to create Notebook'));
  };

  render() {
    return (
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column>
            <CreateNotebookForm onSubmit={this.createNotebook} />
          </Grid.Column>
          <Grid.Column>
            <h2>Notebook Preview</h2>
            <NotebookCard notebook={this.props.notebook} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
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

export { CreateNotebookContainer as PureCreateNotebooksContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(CreateNotebookContainer);
