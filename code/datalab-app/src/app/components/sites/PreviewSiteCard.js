import React, { Component } from 'react';
import { connect } from 'react-redux';
import StackCard from '../stacks/StackCard';

class PreviewSiteCard extends Component {
  render() {
    return (
      <StackCard stack={this.props.stack} />
    );
  }
}

function mapStateToProps({ form }) {
  let stack = {};
  if (form && form.createSite && form.createSite.values) {
    stack = form.createSite.values;
  }
  return {
    stack,
  };
}

export { PreviewSiteCard as PurePreviewSiteCard }; // export for testing
export default connect(mapStateToProps)(PreviewSiteCard);
