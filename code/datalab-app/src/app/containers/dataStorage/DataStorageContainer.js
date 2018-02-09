import React, { Component } from 'react';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import { pick } from 'lodash';
import {
  MODAL_TYPE_CREATE_DATA_STORE,
  MODAL_TYPE_CONFIRMATION,
  MODAL_TYPE_ROBUST_CONFIRMATION,
} from '../../constants/modaltypes';
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
    this.openDataStore = this.openDataStore.bind(this);
    this.createDataStore = this.createDataStore.bind(this);
    this.openCreationForm = this.openCreationForm.bind(this);
    this.deleteDataStore = this.deleteDataStore.bind(this);
    this.confirmDeleteDataStore = this.confirmDeleteDataStore.bind(this);
    this.prohibitDeletion = this.prohibitDeletion.bind(this);
    this.chooseDialogue = this.chooseDialogue.bind(this);
  }

  openDataStore = id =>
    this.props.actions.getCredentials(id)
      .then(payload => pick(payload.value, ['url', 'accessKey']))
      .then(({ url, accessKey }) => this.props.actions.openMinioDataStore(url, accessKey))
      .catch(err => notify.error(`Unable to open ${TYPE_NAME}`));

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
    this.props.actions.openModalDialog(MODAL_TYPE_ROBUST_CONFIRMATION, {
      title: `Delete ${dataStore.displayName} ${TYPE_NAME}`,
      body: `Are you sure you want to delete the ${dataStore.displayName} (${dataStore.name}) ${TYPE_NAME}? This will
      destroy all data stored on the volume.`,
      confirmField: {
        label: `Please type "${dataStore.name}" to confirm`,
        expectedValue: dataStore.name,
      },
      onSubmit: () => this.deleteDataStore(dataStore),
      onCancel: this.props.actions.closeModalDialog,
    });

  prohibitDeletion = dataStore =>
    this.props.actions.openModalDialog(MODAL_TYPE_CONFIRMATION, {
      title: `Unable to Delete ${dataStore.displayName} ${TYPE_NAME}`,
      body: `${TYPE_NAME} is in use, unable to delete.`,
      onCancel: this.props.actions.closeModalDialog,
    });

  chooseDialogue = (dataStore) => {
    if (dataStore.stacksMountingStore.length > 0) {
      return this.prohibitDeletion(dataStore);
    }

    return this.confirmDeleteDataStore(dataStore);
  };

  componentWillMount() {
    this.props.actions.loadDataStorage();
  }

  render() {
    return (
      <PromisedContentWrapper promise={this.props.dataStorage}>
        <StackCards
          stacks={this.props.dataStorage.value}
          typeName={TYPE_NAME}
          openStack={this.openDataStore}
          deleteStack={this.chooseDialogue}
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
    getCredentials: PropTypes.func.isRequired,
    createDataStore: PropTypes.func.isRequired,
    deleteDataStore: PropTypes.func.isRequired,
    openMinioDataStore: PropTypes.func.isRequired,
    openModalDialog: PropTypes.func.isRequired,
    closeModalDialog: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ dataStorage }) {
  return { dataStorage };
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
