import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import NavMenu from './NavMenu';
import menuActions from '../../actions/menuActions';
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
      <div>
        <AppBar
          title="Data Labs"
          onLeftIconButtonTouchTap={this.props.actions.showMenu}
          onRightIconButtonTouchTap={this.userLoginLogout}
          iconElementRight={
            <RaisedButton
              label={this.isUserLoggedIn() ? 'Logout' : 'Login'}
              secondary
            />}
        />
        <Drawer open={this.props.menu.isMenuOpen} docked={false} onRequestChange={this.props.actions.hideMenu}>
          <NavMenu hideMenu={this.props.actions.hideMenu} />
        </Drawer>
      </div>
    );
  }
}

function mapStateToProps({ menu, authentication: { user } }) {
  return {
    menu,
    user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...authActions,
      ...menuActions,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
