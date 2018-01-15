import React, { Component } from 'react';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import { MODAL_TYPE_CREATE_DATA_STORE, MODAL_TYPE_CONFIRMATION } from '../../constants/modaltypes';
import dataStorageActions from '../../actions/dataStorageActions';
import modalDialogActions from '../../actions/modalDialogActions';
import StackCards from '../../components/stacks/StackCards';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import notify from '../../components/common/notify';

const TYPE_NAME = 'Data Store';
const FORM_NAME = 'createDataStore';

class DataStorageContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.createDataStore = this.createDataStore.bind(this);
    this.openCreationForm = this.openCreationForm.bind(this);
    this.deleteDataStore = this.deleteDataStore.bind(this);
    this.confirmDeleteDataStore = this.confirmDeleteDataStore.bind(this);
  }

  createDataStore = dataStore =>
    Promise.resolve(this.props.actions.closeModalDialog())
      .then(() => this.props.actions.createDataStore(dataStore))
      .then(() => this.props.actions.resetForm())
      .then(() => notify.success(`${TYPE_NAME} created`))
      .catch(err => notify.error(`Unable to create ${TYPE_NAME}`))
      .finally(() => this.props.actions.loadDataStorage());

  openCreationForm = dataStore =>
    this.props.actions.openModalDialog(MODAL_TYPE_CREATE_DATA_STORE, {
      title: `Create a ${TYPE_NAME}`,
      onSubmit: this.createDataStore,
      onCancel: this.props.actions.closeModalDialog,
    });

  deleteDataStore = dataStore =>
    Promise.resolve(this.props.actions.closeModalDialog())
      .then(() => this.props.actions.deleteDataStore(dataStore))
      .then(() => notify.success(`${TYPE_NAME} deleted`))
      .catch(err => notify.error(`Unable to delete ${TYPE_NAME}`))
      .finally(() => this.props.actions.loadDataStorage());

  confirmDeleteDataStore = dataStore =>
    this.props.actions.openModalDialog(MODAL_TYPE_CONFIRMATION, {
      title: `Delete ${dataStore.displayName} ${TYPE_NAME}`,
      body: `Are you sure you want to delete the ${dataStore.displayName} ${TYPE_NAME}? This will destroy all data 
      stored on the volume.`,
      onSubmit: () => this.deleteDataStore(dataStore),
      onCancel: this.props.actions.closeModalDialog,
    });

  componentWillMount() {
    this.props.actions.loadDataStorage();
  }

  render() {
    return (
      <PromisedContentWrapper promise={this.props.dataStorage}>
        <StackCards
          stacks={this.props.dataStorage.value}
          typeName={TYPE_NAME}
          openStack={this.props.actions.openMinioDataStore}
          deleteStack={this.confirmDeleteDataStore}
          openCreationForm={this.openCreationForm} />
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
    createDataStore: PropTypes.func.isRequired,
    deleteDataStore: PropTypes.func.isRequired,
    openMinioDataStore: PropTypes.func.isRequired,
    openModalDialog: PropTypes.func.isRequired,
    closeModalDialog: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ dataStorage }) {
  // This needs fixing
  return {
    dataStorage: {
      ...dataStorage,
      value: dataStorage.value.map(dataStore => ({
        ...dataStore,
        displayName: dataStore.name,
        type: dataStore.storageType,
      })),
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...dataStorageActions,
      ...modalDialogActions,
      resetForm: () => reset(FORM_NAME),
    }, dispatch),
  };
}

export { DataStorageContainer as PureDataStorageContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(DataStorageContainer);
