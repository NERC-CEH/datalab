import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import NavMenu from './NavMenu';
import menuActions from '../../actions/menuActions';
import authActions from '../../actions/authActions';
import { login, logout, isAuthenticated } from '../../auth/auth';

class Navigation extends Component {
  constructor(props, context) {
    super(props, context);
    this.userLoggedIn = this.userLoggedIn.bind(this);
    this.userLoginLogout = this.userLoginLogout.bind(this);
  }

  userLoggedIn() {
    return isAuthenticated(this.props.user);
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
        <AppBar
          title="Data Labs"
          onLeftIconButtonTouchTap={this.props.actions.showMenu}
          onRightIconButtonTouchTap={this.userLoginLogout}
          iconElementRight={
            <RaisedButton
              label={this.userLoggedIn() ? 'Logout' : 'Login'}
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
