import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import notebookActions from '../../actions/notebookActions';
import NotebookCards from './NotebookCards';
import PromisedContentWrapper from '../common/PromisedContentWrapper';

class NotebooksContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.openNotebook = this.openNotebook.bind(this);
  }

  openNotebook(id) {
    this.props.actions.getUrl(id)
      .then(payload => this.props.actions.openNotebook(payload.value.redirectUrl))
      .catch(err => console.log(err.message, 'error'));
  }

  componentWillMount() {
    this.props.actions.loadNotebooks();
  }

  render() {
    return (
      <PromisedContentWrapper promise={this.props.notebooks}>
        <NotebookCards
          notebooks={this.props.notebooks.value}
          openNotebook={this.openNotebook} />
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
    loadNotebooks: PropTypes.func.isRequired,
    getUrl: PropTypes.func.isRequired,
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
