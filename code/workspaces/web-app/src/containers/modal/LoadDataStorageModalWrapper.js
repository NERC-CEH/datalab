import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dataStorageActions from '../../actions/dataStorageActions';

class LoadDataStorageModalWrapper extends Component {
  constructor(props, context) {
    super(props, context);
    this.getDataStorage = this.getDataStorage.bind(this);
  }

  componentWillMount() {
    // Added .catch to prevent unhandled promise error, when lacking permission to view content
    this.props.actions.loadDataStorage(this.props.projectKey)
      .catch((() => {}));
  }

  getDataStorage() {
    const dataStorage = this.props.dataStorage.value || [];
    return dataStorage.map(store => ({ text: store.displayName, value: store.name }));
  }

  render() {
    const { Dialog } = this.props;

    return (
      <Dialog
        onCancel={this.props.onCancel}
        onSubmit={this.props.onSubmit}
        title={this.props.title}
        dataStorageOptions={this.getDataStorage()} />
    );
  }
}

LoadDataStorageModalWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  Dialog: PropTypes.any.isRequired,
  projectKey: PropTypes.string.isRequired,
};

function mapStateToProps({ dataStorage }) {
  return { dataStorage };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...dataStorageActions,
    }, dispatch),
  };
}

export { LoadDataStorageModalWrapper as PureLoadDataStorageModalWrapper }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(LoadDataStorageModalWrapper);
