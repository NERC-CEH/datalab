import React from 'react';
import { shallow } from 'enzyme';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router-dom';
import NavMenu from './NavMenu';

describe('NavMenu component', () => {
  function setup(hideMenu = () => {}) {
    return shallow(<NavMenu hideMenu={hideMenu} />);
  }

  it('renders MenuItems', () => {
    // Arrange
    const expectedHideMenu = () => {};

    // Act
    const menuItems = setup(expectedHideMenu).children();

    // Assert
    expect(menuItems.length).toBe(2);
    menuItems.forEach((item) => {
      expect(item.type()).toBe(MenuItem);
      expect(item.prop('onTouchTap')).toBe(expectedHideMenu);
    });
  });

  it('renders Links', () => {
    // Arrange/Act
    const menuItems = setup().find('MenuItem');

    // Assert
    const links = menuItems.map(item => item.childAt(0));
    links.map(link => expect(link.type()).toBe(Link));
  });

  it('has correct links', () => {
        // Arrange/Act
    const menuItems = setup();

    // Assert
    expect(menuItems.find({ to: '/' }).length).toBe(1);
    expect(menuItems.find({ to: '/example' }).length).toBe(1);
  });
});
