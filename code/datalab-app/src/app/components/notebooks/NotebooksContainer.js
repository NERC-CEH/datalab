import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import notebookActions from '../../actions/notebookActions';
import NotebookButton from './NotebookButton';

class NotebooksContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.openNotebook = this.openNotebook.bind(this);
  }
  componentWillMount() {
    this.props.actions.loadNotebooks();
  }

  openNotebook(notebook) {
    if (notebook.type === 'zeppelin') {
      this.props.actions.openNotebook(notebook.url, notebook.token);
    } else if (notebook.type === 'jupyter') {
      window.open(`${notebook.url}/tree/?token=${notebook.token}`);
    }
  }

  render() {
    return (
      <div>
        { this.props.notebooks.value.map((notebook, index) => (
          <NotebookButton key={index} notebook={notebook} openNotebookAction={this.openNotebook} />
        ))}
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
