import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import dataStorageActions from '../../actions/dataStorageActions';

class CreateStacksModalWrapper extends Component {
  constructor(props, context) {
    super(props, context);
    this.getDataStorage = this.getDataStorage.bind(this);
    this.getProjectKey = this.getProjectKey.bind(this);
  }

  componentWillMount() {
    // Added .catch to prevent unhandled promise error, when lacking permission to view content
    this.props.actions.loadDataStorage(this.getProjectKey())
      .catch((() => {}));
  }

  getDataStorage() {
    const dataStorage = this.props.dataStorage.value || [];

    return dataStorage.map(store => ({ text: store.displayName, value: store.name }));
  }

  getProjectKey() {
    const projects = this.props.projects.value || {};

    return get(projects, 'currentProject.key');
  }

  render() {
    const { Dialog } = this.props;

    return (
      <Dialog
        onCancel={this.props.onCancel}
        onSubmit={this.props.onSubmit}
        title={this.props.title}
        dataStorageOptions={this.getDataStorage()}
        projectKey={this.getProjectKey()} />
    );
  }
}

CreateStacksModalWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  Dialog: PropTypes.func.isRequired,
};

function mapStateToProps({ dataStorage, projects }) {
  return { dataStorage, projects };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...dataStorageActions,
    }, dispatch),
  };
}

export { CreateStacksModalWrapper as PureCreateStacksModalWrapper }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(CreateStacksModalWrapper);
