import React, { Component } from 'react';
import Promise from 'bluebird';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import NewNotebookButton from './NewNotebookButton';
import stackActions from '../../actions/stackActions';
import modalDialogActions from '../../actions/modalDialogActions';
import notify from '../common/notify';
import { MODAL_TYPE_CREATE_NOTEBOOK } from '../../constants/modaltypes';

class CreateNotebookContainer extends Component {
  createNotebook = notebook =>
    Promise.resolve(this.props.actions.closeModalDialog())
      .then(() => this.props.actions.createStack(notebook))
      .then(this.props.actions.resetForm)
      .then(() => notify.success('Notebook created'))
      .catch(err => notify.error('Unable to create Notebook'))
      .finally(this.props.actions.loadStacksByCategory('analysis'));

  openCreationForm = () => this.props.actions.openModalDialog(MODAL_TYPE_CREATE_NOTEBOOK, {
    title: 'Create a Notebook',
    onSubmit: this.createNotebook,
    onCancel: this.props.actions.closeModalDialog,
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
      ...stackActions,
      ...modalDialogActions,
      resetForm: () => reset('createNotebook'),
    }, dispatch),
  };
}

export { CreateNotebookContainer as PureCreateNotebookContainer }; // export for testing
export default connect(undefined, mapDispatchToProps)(CreateNotebookContainer);
