import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Divider } from 'semantic-ui-react';
import notebookActions from '../../actions/notebookActions';
import NotebookCards from './NotebookCards';
import CreateNotebookForm from './CreateNotebookForm';
import PromisedContentWrapper from '../common/PromisedContentWrapper';
import notify from '../common/notify';

class NotebooksContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.openNotebook = this.openNotebook.bind(this);
    this.createNotebook = this.createNotebook.bind(this);
  }

  openNotebook(id) {
    return this.props.actions.getUrl(id)
      .then(payload => this.props.actions.openNotebook(payload.value.redirectUrl))
      .catch(err => notify.error('Unable to open Notebook'));
  }

  createNotebook(notebook) {
    return this.props.actions.createNotebook(notebook)
      .then(this.props.actions.loadNotebooks())
      .catch(err => notify.error('Unable to create Notebook'));
  }

  componentWillMount() {
    this.props.actions.loadNotebooks();
  }

  render() {
    return (
      <div>
        <PromisedContentWrapper promise={this.props.notebooks}>
          <NotebookCards
            notebooks={this.props.notebooks.value}
            openNotebook={this.openNotebook} />
        </PromisedContentWrapper>
        <Divider/>
        <CreateNotebookForm createNotebook={this.createNotebook}/>
      </div>
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
    loadNotebooks: PropTypes.func.isRequired,
    getUrl: PropTypes.func.isRequired,
    openNotebook: PropTypes.func.isRequired,
    createNotebook: PropTypes.func.isRequired,
  }).isRequired,
};

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

export { NotebooksContainer as PureNotebooksContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(NotebooksContainer);
