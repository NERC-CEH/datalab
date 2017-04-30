import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import NavMenu from './NavMenu';
import menuActions from '../actions/menuActions';

const Navigation = ({ isMenuOpen, actions: { showMenu, hideMenu } }) => (
  <div>
    <AppBar title="Data Labs" onLeftIconButtonTouchTap={showMenu} />
    <Drawer open={isMenuOpen} docked={false} onRequestChange={hideMenu}>
      <NavMenu />
    </Drawer>
  </div>
);

function mapStateToProps(state) {
  return state.menu;
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ ...menuActions }, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
