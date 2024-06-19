import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { mapKeys, get, find } from 'lodash';
import userActions from '../../actions/userActions';

class LoadUserManagementModalWrapper extends Component {
  componentDidMount() {
    // Added .catch to prevent unhandled promise error, when lacking permission to view content
    this.props.actions.listUsers()
      .catch(() => {});
  }

  shouldComponentUpdate(nextProps) {
    const isFetching = nextProps.dataStorage.fetching;
    return !isFetching;
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
        stack={this.props.stack}
        typeName={this.props.typeName}
        projectKey={this.props.projectKey}
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

function mapStateToProps({ dataStorage, users }) {
  return { dataStorage, users };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...userActions,
    }, dispatch),
  };
}

export { LoadUserManagementModalWrapper as PureLoadUserManagementModalWrapper }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(LoadUserManagementModalWrapper);
