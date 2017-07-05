import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import NavMenu from './NavMenu';
import authActions from '../../actions/authActions';
import auth from '../../auth/auth';

class Navigation extends Component {
  constructor(props, context) {
    super(props, context);
    this.isUserLoggedIn = this.isUserLoggedIn.bind(this);
    this.userLoginLogout = this.userLoginLogout.bind(this);
  }

  componentWillMount() {
    const currentSession = auth.getCurrentSession();
    if (currentSession) {
      this.props.actions.userLogsIn(currentSession);
    }
  }

  isUserLoggedIn() {
    return this.props.user && auth.isAuthenticated(this.props.user);
  }

  userLoginLogout() {
    if (this.isUserLoggedIn()) {
      auth.logout();
    } else {
      auth.login();
    }
  }

  render() {
    return (
      <NavMenu
        routePathname={this.props.routePathname}
        routeTo={this.props.actions.routeTo}
        isUserLoggedIn={this.isUserLoggedIn}
        userLoginLogout={this.userLoginLogout}
        inverted
        pointing
        secondary
      />
    );
  }
}

function mapStateToProps({ authentication: { user }, router: { location: { pathname } } }) {
  return {
    user,
    routePathname: pathname,
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

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
