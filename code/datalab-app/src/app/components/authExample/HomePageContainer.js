import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import authActions from '../../actions/authActions';
import { login, logout, isAuthenticated } from '../../auth/auth';

class HomePageContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.userLoggedIn = this.userLoggedIn.bind(this);
    this.userLoginLogout = this.userLoginLogout.bind(this);
  }

  userLoggedIn() {
    return this.props.user && isAuthenticated(this.props.user.expiresAt);
  }

  userLoginLogout() {
    if (this.userLoggedIn()) {
      logout().then(() => this.props.actions.userLogsOut());
    } else {
      // Not promise as user will be redirected away from page.
      login();
    }
  }

  render() {
    return (
      <div>
        <p>This is the data lab home page.</p>
        <p>{`You are currently ${this.userLoggedIn() ? 'logged in.' : 'not logged in.'}`}</p>
        <RaisedButton label={this.userLoggedIn() ? 'logout' : 'login'} primary onClick={() => this.userLoginLogout()} />
      </div>
    );
  }
}

function mapStateToProps({ authentication: { user } }) {
  return {
    user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...authActions,
      routeTo: push,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePageContainer);
