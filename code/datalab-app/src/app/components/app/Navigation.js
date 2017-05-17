import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import NavMenu from './NavMenu';
import menuActions from '../../actions/menuActions';

const Navigation = ({ isMenuOpen, actions: { showMenu, hideMenu } }) => (
  <div>
    <AppBar title="Data Labs" onLeftIconButtonTouchTap={showMenu} />
    <Drawer open={isMenuOpen} docked={false} onRequestChange={hideMenu}>
      <NavMenu hideMenu={hideMenu} />
    </Drawer>
  </div>
);

Navigation.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    showMenu: PropTypes.func.isRequired,
    hideMenu: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return state.menu;
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ ...menuActions }, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
