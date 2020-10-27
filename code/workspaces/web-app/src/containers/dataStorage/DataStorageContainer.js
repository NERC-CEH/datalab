import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pick } from 'lodash';
import { reset } from 'redux-form';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { permissionTypes } from 'common';
import {
  MODAL_TYPE_CREATE_DATA_STORE,
  MODAL_TYPE_CONFIRMATION,
  MODAL_TYPE_ROBUST_CONFIRMATION,
  MODAL_TYPE_EDIT_DATA_STORE,
} from '../../constants/modaltypes';
import dataStorageActions from '../../actions/dataStorageActions';
import modalDialogActions from '../../actions/modalDialogActions';
import currentProjectSelectors from '../../selectors/currentProjectSelectors';
import notify from '../../components/common/notify';
import StackCards from '../../components/stacks/StackCards';

const { projectPermissions: { PROJECT_KEY_STORAGE_CREATE, PROJECT_KEY_STORAGE_DELETE, PROJECT_KEY_STORAGE_OPEN, PROJECT_KEY_STORAGE_EDIT }, projectKeyPermission } = permissionTypes;

export const TYPE_NAME = 'Data Store';
const TYPE_NAME_PLURAL = 'Data Stores';
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
    this.editDataStore = this.editDataStore.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.projectKey !== prevProps.projectKey) {
      this.props.actions.loadDataStorage(this.props.projectKey);
    }
  }

  openDataStore = dataStore => this.props.actions.getCredentials(this.props.projectKey, dataStore.id)
    .then(payload => pick(payload.value, ['url', 'accessKey']))
    .then(({ url, accessKey }) => this.props.actions.openMinioDataStore(url, accessKey))
    .catch(err => notify.error(`Unable to open ${TYPE_NAME}`));

  createDataStore = dataStore => Promise.resolve(this.props.actions.closeModalDialog())
    .then(() => this.props.actions.createDataStore(this.props.projectKey, dataStore))
    .then(() => this.props.actions.resetForm())
    .then(() => notify.success(`${TYPE_NAME} created`))
    .catch(err => notify.error(`Unable to create ${TYPE_NAME}`))
    .finally(() => this.props.actions.loadDataStorage(this.props.projectKey));

  openCreationForm = dataStore => this.props.actions.openModalDialog(MODAL_TYPE_CREATE_DATA_STORE, {
    title: `Create a ${TYPE_NAME}`,
    onSubmit: this.createDataStore,
    onCancel: this.props.actions.closeModalDialog,
    projectKey: this.props.projectKey,
  });

  deleteDataStore = dataStore => Promise.resolve(this.props.actions.closeModalDialog())
    .then(() => this.props.actions.deleteDataStore(this.props.projectKey, dataStore))
    .then(() => notify.success(`${TYPE_NAME} deleted`))
    .catch(err => notify.error(`Unable to delete ${TYPE_NAME}`))
    .finally(() => this.props.actions.loadDataStorage(this.props.projectKey));

  confirmDeleteDataStore = dataStore => this.props.actions.openModalDialog(MODAL_TYPE_ROBUST_CONFIRMATION, {
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

  prohibitDeletion = dataStore => this.props.actions.openModalDialog(MODAL_TYPE_CONFIRMATION, {
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

  editDataStore = (stack) => {
    const { displayName, id } = stack;
    this.props.actions.openModalDialog(MODAL_TYPE_EDIT_DATA_STORE, {
      title: `Edit Data Store: ${displayName}`,
      onCancel: this.props.actions.closeModalDialog,
      projectKey: this.props.projectKey,
      dataStoreId: id,
      userKeysMapping: {
        name: 'label',
        userId: 'value',
      },
      stack,
      typeName: TYPE_NAME,
    });
  };

  componentDidMount() {
    // Added .catch to prevent unhandled promise error, when lacking permission to view content
    if (this.props.projectKey) {
      this.props.actions.loadDataStorage(this.props.projectKey)
        .catch((() => {
        }));
    }
  }

  render() {
    return (
      <StackCards
        stacks={this.props.dataStorage}
        typeName={TYPE_NAME}
        typeNamePlural={TYPE_NAME_PLURAL}
        openStack={this.openDataStore}
        deleteStack={this.chooseDialogue}
        editStack={this.editDataStore}
        openCreationForm={this.openCreationForm}
        userPermissions={() => this.props.userPermissions}
        createPermission={projectKeyPermission(PROJECT_KEY_STORAGE_CREATE, this.props.projectKey)}
        openPermission={projectKeyPermission(PROJECT_KEY_STORAGE_OPEN, this.props.projectKey)}
        deletePermission={projectKeyPermission(PROJECT_KEY_STORAGE_DELETE, this.props.projectKey)}
        editPermission={projectKeyPermission(PROJECT_KEY_STORAGE_EDIT, this.props.projectKey)}
      />
    );
  }
}

DataStorageContainer.propTypes = {
  dataStorage: PropTypes.shape({
    error: PropTypes.any,
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.array.isRequired,
  }).isRequired,
  projectKey: PropTypes.string, // not marked as required as get prop validation errors when get from state
  actions: PropTypes.shape({
    loadDataStorage: PropTypes.func.isRequired,
    getCredentials: PropTypes.func.isRequired,
    createDataStore: PropTypes.func.isRequired,
    deleteDataStore: PropTypes.func.isRequired,
    openMinioDataStore: PropTypes.func.isRequired,
    openModalDialog: PropTypes.func.isRequired,
    closeModalDialog: PropTypes.func.isRequired,
  }).isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function mapStateToProps(state) {
  return {
    dataStorage: state.dataStorage,
    projectKey: currentProjectSelectors.currentProjectKey(state).value,
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
