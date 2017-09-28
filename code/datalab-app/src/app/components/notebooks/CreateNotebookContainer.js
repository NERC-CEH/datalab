import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import NewNotebookButton from './NewNotebookButton';
import notebookActions from '../../actions/notebookActions';
import modalDialogActions from '../../actions/modalDialogActions';
import notify from '../common/notify';
import { MODAL_TYPE_CREATE_NOTEBOOK } from '../../constants/modaltypes';

class CreateNotebookContainer extends Component {
  createNotebook = notebook =>
    Promise.resolve(this.props.actions.closeModalDialog())
      .then(() => this.props.actions.createNotebook(notebook))
      .then(this.props.actions.resetForm)
      .then(this.props.actions.loadNotebooks)
      .then(() => notify.success('Notebook created'))
      .catch(err => notify.error('Unable to create Notebook'));

  openCreationForm = () => this.props.actions.openModalDialog(MODAL_TYPE_CREATE_NOTEBOOK, {
    title: 'Create a Notebook',
    onSubmit: this.createNotebook,
    onCancel: this.props.actions.closeModalDialog,
    notebook: this.props.notebook,
  });

  render() {
    return (
      <NewNotebookButton onClick={this.openCreationForm} />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...notebookActions,
      ...modalDialogActions,
      resetForm: () => reset('createNotebook'),
    }, dispatch),
  };
}

export { CreateNotebookContainer as PureCreateNotebookContainer }; // export for testing
export default connect(undefined, mapDispatchToProps)(CreateNotebookContainer);
