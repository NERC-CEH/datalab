import React, { Component } from 'react';
import { connect } from 'react-redux';
import NotebookCard from './NotebookCard';

class PreviewNotebookCard extends Component {
  render() {
    return (
      <NotebookCard notebook={this.props.notebook} />
    );
  }
}

function mapStateToProps({ form }) {
  let notebook = {};
  if (form && form.createNotebook && form.createNotebook.values) {
    notebook = form.createNotebook.values;
  }
  return {
    notebook,
  };
}

export { PreviewNotebookCard as PurePreviewNotebookCard }; // export for testing
export default connect(mapStateToProps)(PreviewNotebookCard);
