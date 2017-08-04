import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import notebookActions from '../../actions/notebookActions';
import NotebookCards from './NotebookCards';

class NotebooksContainer extends Component {
  componentWillMount() {
    this.props.actions.loadNotebooks();
  }

  render() {
    return (
      <NotebookCards notebooks={this.props.notebooks.value} openNotebook={this.props.actions.openNotebook} />
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
    openNotebook: PropTypes.func.isRequired,
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
