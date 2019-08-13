import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pick } from 'lodash';
import { reset } from 'redux-form';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  MODAL_TYPE_CREATE_DATA_STORE,
  MODAL_TYPE_CONFIRMATION,
  MODAL_TYPE_ROBUST_CONFIRMATION,
  MODAL_TYPE_EDIT_DATA_STORE,
} from '../../constants/modaltypes';
import { permissionTypes } from 'common';
import dataStorageActions from '../../actions/dataStorageActions';
import modalDialogActions from '../../actions/modalDialogActions';
import notify from '../../components/common/notify';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import StackCards from '../../components/stacks/StackCards';

const { projectPermissions: { PROJECT_STORAGE_CREATE, PROJECT_STORAGE_DELETE, PROJECT_STORAGE_OPEN, PROJECT_STORAGE_EDIT } } = permissionTypes;

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
    this.editDataStore = this.editDataStore.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const isFetching = nextProps.dataStorage.fetching;
    return !isFetching;
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

  editDataStore = ({ displayName, id }) =>
    this.props.actions.openModalDialog(MODAL_TYPE_EDIT_DATA_STORE, {
      title: `Edit Data Store: ${displayName}`,
      onCancel: this.props.actions.closeModalDialog,
      dataStoreId: id,
      userKeysMapping: { name: 'label', userId: 'value' },
    });

  componentWillMount() {
    // Added .catch to prevent unhandled promise error, when lacking permission to view content
    this.props.actions.loadDataStorage()
      .catch((() => {}));
  }

  render() {
    return (
      <PromisedContentWrapper promise={this.props.dataStorage}>
        <StackCards
          stacks={this.props.dataStorage.value}
          typeName={TYPE_NAME}
          openStack={this.openDataStore}
          deleteStack={this.chooseDialogue}
          editStack={this.editDataStore}
          openCreationForm={this.openCreationForm}
          userPermissions={this.props.userPermissions}
          createPermission={PROJECT_STORAGE_CREATE}
          openPermission={PROJECT_STORAGE_OPEN}
          deletePermission={PROJECT_STORAGE_DELETE}
          editPermission={PROJECT_STORAGE_EDIT}
        />
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
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
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
