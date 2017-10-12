import React, { Component } from 'react';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MODAL_TYPE_CONFIRMATION } from '../../constants/modaltypes';
import stackActions from '../../actions/stackActions';
import modalDialogActions from '../../actions/modalDialogActions';
import NotebookCards from './NotebookCards';
import PromisedContentWrapper from '../common/PromisedContentWrapper';
import notify from '../common/notify';

class NotebooksContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.openNotebook = this.openNotebook.bind(this);
    this.confirmDeleteNotebook = this.confirmDeleteNotebook.bind(this);
  }

  openNotebook(id) {
    return this.props.actions.getUrl(id)
      .then(payload => this.props.actions.openStack(payload.value.redirectUrl))
      .catch(err => notify.error('Unable to open Notebook'));
  }

  deleteNotebook = notebook =>
    Promise.resolve(this.props.actions.closeModalDialog())
      .then(() => this.props.actions.deleteStack(notebook))
      .then(() => notify.success('Notebook deleted'))
      .catch(err => notify.error('Unable to delete Notebook'))
      .finally(this.props.actions.loadStacks);

  confirmDeleteNotebook(notebook) {
    this.props.actions.openModalDialog(MODAL_TYPE_CONFIRMATION, {
      title: `Delete ${notebook.displayName} Notebook`,
      body: `Would you like to delete the ${notebook.displayName} notebook? Any saved work will continue to be 
        stored in the shared drive.`,
      onSubmit: () => this.deleteNotebook(notebook),
      onCancel: this.props.actions.closeModalDialog,
    });
  }

  componentWillMount() {
    this.props.actions.loadStacks();
  }

  render() {
    return (
      <PromisedContentWrapper promise={this.props.notebooks}>
        <NotebookCards
          notebooks={this.props.notebooks.value}
          openNotebook={this.openNotebook}
          deleteNotebook={this.confirmDeleteNotebook}/>
      </PromisedContentWrapper>
    );
  }
}

NotebooksContainer.propTypes = {
  notebooks: PropTypes.shape({
    error: PropTypes.any,
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.array.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    loadStacks: PropTypes.func.isRequired,
    getUrl: PropTypes.func.isRequired,
    openStack: PropTypes.func.isRequired,
    deleteStack: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ notebooks }) {
  return { notebooks };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...stackActions,
      ...modalDialogActions,
    }, dispatch),
  };
}

export { NotebooksContainer as PureNotebooksContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(NotebooksContainer);
