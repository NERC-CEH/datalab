import React, { Component } from 'react';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MODAL_TYPE_CREATE_DATA_STORE, MODAL_TYPE_CONFIRMATION } from '../../constants/modaltypes';
import dataStorageActions from '../../actions/dataStorageActions';
import modalDialogActions from '../../actions/modalDialogActions';
import StackCards from '../../components/stacks/StackCards';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import notify from '../../components/common/notify';

const CONTAINER_TYPE = 'dataStore';
const TYPE_NAME = 'Data Store';

class DataStorageContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.deleteDataStore = this.deleteDataStore.bind(this);
    this.confirmDeleteStack = this.confirmDeleteStack.bind(this);
  }

  deleteDataStore = dataStore =>
    Promise.resolve(this.props.actions.deleteDataStore(dataStore))
      .then(() => notify.success('Data store deleted'))
      .catch(err => notify.error('Unable to delete store'))
      .finally(() => this.props.actions.loadDataStorage());

  confirmDeleteStack(dataStore) {
    this.props.actions.openModalDialog(MODAL_TYPE_CONFIRMATION, {
      title: `Delete ${dataStore.displayName} ${TYPE_NAME}`,
      body: `Are you sure you want to delete the ${dataStore.displayName} ${TYPE_NAME}? This will destroy all data 
      stored on the volume.`,
      onSubmit: () => this.deleteDataStore(dataStore),
      onCancel: this.props.actions.closeModalDialog,
    });
  }

  componentWillMount() {
    this.props.actions.loadDataStorage();
  }

  render() {
    return (
      <PromisedContentWrapper promise={this.props.dataStorage}>
        <StackCards
          stacks={this.props.dataStorage.value}
          typeName={TYPE_NAME}
          containerType={CONTAINER_TYPE}
          dialogAction={MODAL_TYPE_CREATE_DATA_STORE}
          formStateName={'createDataStore'}
          openStack={this.props.actions.openMinioDataStore}
          deleteStack={this.confirmDeleteStack} />
      </PromisedContentWrapper>
    );
  }
}

DataStorageContainer.propTypes = {
  dataStorage: PropTypes.shape({
    error: PropTypes.any,
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.array.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    loadDataStorage: PropTypes.func.isRequired,
    openMinioDataStore: PropTypes.func.isRequired,
    deleteDataStore: PropTypes.func.isRequired,
    openModalDialog: PropTypes.func.isRequired,
    closeModalDialog: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ dataStorage }) {
  return {
    dataStorage: {
      ...dataStorage,
      value: dataStorage.value.map(dataStore => ({
        ...dataStore,
        displayName: dataStore.name,
        type: dataStore.storageType,
        // description: 'store description'
      })),
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...dataStorageActions,
      ...modalDialogActions,
    }, dispatch),
  };
}

export { DataStorageContainer as PureDataStorageContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(DataStorageContainer);
