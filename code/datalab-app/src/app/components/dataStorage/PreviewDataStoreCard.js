import React, { Component } from 'react';
import { connect } from 'react-redux';
import StackCard from '../stacks/StackCard';

class PreviewDataStoreCard extends Component {
  render() {
    return (
      <StackCard stack={this.props.stack} typeName="dataStore" />
    );
  }
}

function mapStateToProps({ form }) {
  let stack = {};
  if (form && form.createDataStore && form.createDataStore.values) {
    stack = form.createDataStore.values;
  }
  return {
    stack,
  };
}

export { PreviewDataStoreCard as PurePreviewDataStoreCard }; // export for testing
export default connect(mapStateToProps)(PreviewDataStoreCard);
