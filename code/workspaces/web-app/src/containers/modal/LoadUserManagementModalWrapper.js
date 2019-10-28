import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { mapKeys, get, find } from 'lodash';
import dataStorageActions from '../../actions/dataStorageActions';
import userActions from '../../actions/userActions';
import notify from '../../components/common/notify';

class LoadUserManagementModalWrapper extends Component {
  constructor(props, context) {
    super(props, context);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  componentDidMount() {
    // Added .catch to prevent unhandled promise error, when lacking permission to view content
    this.props.actions.listUsers()
      .catch(() => {});
  }

  shouldComponentUpdate(nextProps) {
    const isFetching = nextProps.dataStorage.fetching;
    return !isFetching;
  }

  addUser({ value }) {
    const { name } = this.getDataStore();
    this.props.actions.addUserToDataStore(this.props.projectKey, { name, users: [value] })
      .then(() => notify.success('User added to data store'))
      .then(() => this.props.actions.loadDataStorage(this.props.projectKey));
  }

  removeUser({ value }) {
    if (this.props.loginUserId !== value) {
      const { name } = this.getDataStore();
      this.props.actions.removeUserFromDataStore(this.props.projectKey, { name, users: [value] })
        .then(() => notify.success('User removed from data store'))
        .then(() => this.props.actions.loadDataStorage(this.props.projectKey));
    } else {
      notify.error('Unable to remove self');
    }
  }

  remapKeys(users) {
    if (this.props.userKeysMapping) {
      return users.map(user => mapKeys(user, (value, key) => get(this.props.userKeysMapping, key)));
    }

    return users;
  }

  getDataStore() {
    return find(this.props.dataStorage.value, ({ id }) => id === this.props.dataStoreId);
  }

  getCurrentUsers() {
    const { users } = this.getDataStore();
    const invertedMapping = Object.entries(this.props.userKeysMapping)
      .map(([key, value]) => ({ [value]: key }))
      .reduce((previous, current) => ({ ...previous, ...current }), {});

    let currentUsers;

    if (!this.props.users.fetching && this.props.users.value.length > 0) {
      currentUsers = users.map(user => find(this.props.users.value, { [invertedMapping.value]: user }));
    } else {
      currentUsers = [];
    }

    return this.remapKeys(currentUsers);
  }

  render() {
    const { Dialog } = this.props;

    return (
      <Dialog
        onCancel={this.props.onCancel}
        title={this.props.title}
        currentUsers={this.getCurrentUsers()}
        userList={this.remapKeys(this.props.users.value)}
        loadUsersPromise={this.props.users}
        addUser={this.addUser}
        removeUser={this.removeUser}
      />
    );
  }
}

LoadUserManagementModalWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  Dialog: PropTypes.func.isRequired,
  dataStoreId: PropTypes.string.isRequired,
  projectKey: PropTypes.string.isRequired,
  userKeysMapping: PropTypes.object.isRequired,
};

function mapStateToProps({ authentication: { identity: { sub } }, dataStorage, users }) {
  return { loginUserId: sub, dataStorage, users };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...dataStorageActions,
      ...userActions,
    }, dispatch),
  };
}

export { LoadUserManagementModalWrapper as PureLoadUserManagementModalWrapper }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(LoadUserManagementModalWrapper);
