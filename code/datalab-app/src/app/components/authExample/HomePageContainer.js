import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';
import { connect } from 'react-redux';
import auth from '../../auth/auth';

class HomePageContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.userLoggedIn = this.userLoggedIn.bind(this);
    this.userLoginLogout = this.userLoginLogout.bind(this);
  }

  userLoggedIn() {
    return this.props.user && auth.isAuthenticated(this.props.user.expiresAt);
  }

  userLoginLogout() {
    if (this.userLoggedIn()) {
      auth.logout();
    } else {
      auth.login();
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

export default connect(mapStateToProps)(HomePageContainer);
