import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dataStorageActions from '../../actions/dataStorageActions';
import userActions from '../../actions/userActions';

class LoadUserManagementModalWrapper extends Component {
  constructor(props, context) {
    super(props, context);
    this.getUserList = this.getUserList.bind(this);
  }

  componentWillMount() {
    // Added .catch to prevent unhandled promise error, when lacking permission to view content
    this.props.actions.listUsers()
      .catch(() => {});
  }

  getUserList() {
    const users = this.props.users.value || [];
    return users;
  }

  render() {
    const Dialog = this.props.Dialog;

    return (
      <Dialog
        onCancel={this.props.onCancel}
        title={this.props.title}
        currentUsers={this.props.currentUsers}
        userList={this.getUserList()}
      />
    );
  }
}

LoadUserManagementModalWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  Dialog: PropTypes.func.isRequired,
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
