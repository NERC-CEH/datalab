import React from 'react';
import { Menu } from 'semantic-ui-react';

const SubMenu = ({ menuTitle, menuItems }) => (
  <Menu.Item>
    <Menu.Header>{menuTitle}</Menu.Header>
    <Menu.Menu>
      {menuItems.map(([Component, props, children], index) => (<Component key={index} {...props}>{children}</Component>))}
    </Menu.Menu>
  </Menu.Item>
);

export default SubMenu;
