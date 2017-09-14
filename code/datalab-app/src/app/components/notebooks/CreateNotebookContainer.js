import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CreateNotebookForm from './CreateNotebookForm';
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
      <CreateNotebookForm onSubmit={this.createNotebook} />
    );
  }
}

function mapStateToProps({ notebooks }) {
  return { notebooks };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...notebookActions,
    }, dispatch),
  };
}

export { CreateNotebookContainer as PureNotebooksContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(CreateNotebookContainer);
