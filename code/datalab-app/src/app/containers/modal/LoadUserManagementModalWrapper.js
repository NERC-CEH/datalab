import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { mapKeys, get, find } from 'lodash';
import dataStorageActions from '../../actions/dataStorageActions';
import userActions from '../../actions/userActions';

class LoadUserManagementModalWrapper extends Component {
  constructor(props, context) {
    super(props, context);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  componentWillMount() {
    // Added .catch to prevent unhandled promise error, when lacking permission to view content
    this.props.actions.listUsers()
      .catch(() => {});
  }

  addUser(value) {
    console.log(value);
  }

  removeUser(value) {
    console.log(value);
  }

  remapKeys(users) {
    if (this.props.userKeysMapping) {
      return users.map(user => mapKeys(user, (value, key) => get(this.props.userKeysMapping, key)));
    }

    return users;
  }

  getCurrentUsers() {
    let currentUsers;

    if (this.props.userKeysMapping) {
      const invertedMapping = Object.entries(this.props.userKeysMapping)
        .map(([key, value]) => ({ [value]: key }))
        .reduce((previous, current) => ({ ...previous, ...current }), {});

      if (!this.props.users.fetching && this.props.users.value.length > 0) {
        currentUsers = this.props.currentUsers.map(user => find(this.props.users.value, { [invertedMapping.value]: user }));
      } else {
        currentUsers = [];
      }
    }

    return this.remapKeys(currentUsers);
  }

  render() {
    const Dialog = this.props.Dialog;

    return (
      <Dialog
        onCancel={this.props.onCancel}
        title={this.props.title}
        currentUsers={this.getCurrentUsers(this.props.currentUsers)}
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
  currentUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
  userKeysMapping: PropTypes.object,
};

function mapStateToProps({ users }) {
  return { users };
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
