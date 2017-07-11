import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';

const SubMenu = ({ menuTitle, menuItems }) => (
  <Menu.Item>
    <Menu.Header>{menuTitle}</Menu.Header>
    <Menu.Menu>
      {menuItems.map(({ Component, props, children }, index) => (<Component key={index} {...props}>{children}</Component>))}
    </Menu.Menu>
  </Menu.Item>
);

SubMenu.propTypes = {
  menuTitle: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      Component: PropTypes.func.isRequired,
      props: PropTypes.object,
      children: PropTypes.string,
    })).isRequired,
};

export default SubMenu;
