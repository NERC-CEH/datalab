import React from 'react';
import { shallow } from 'enzyme';
import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import SubMenu from './SubMenu';

describe('SubMenu', () => {
  function shallowRender(menuTitle, menuItems = []) {
    return shallow(<SubMenu menuTitle={menuTitle} menuItems={menuItems} />);
  }

  const generateItems = () => [
    { Component: Menu.Item, props: { expectedProps: 'firstExpectedProps' }, children: 'firstExpectedChildren' },
    { Component: Menu.Item, props: { expectedProps: 'secondExpectedProps' }, children: 'secondExpectedChildren' },
    { Component: NavLink, props: { to: '/', expectedProps: 'thirdExpectedProps' }, children: 'thirdExpectedChildren' },
    { Component: NavLink, props: { to: '/', expectedProps: 'fourthExpectedProps' }, chilren: 'fourthExpectedChildren' },
  ];

  it('render menu title', () => {
    // Arrange / Act
    const output = shallowRender('expectedTitle').find('MenuHeader');

    // Assert
    expect(output.prop('children')).toBe('expectedTitle');
  });

  it('renders correct menu item components', () => {
    // Arrange
    const menuItems = generateItems();

    // Act
    const output = shallowRender('expectedTitle', menuItems).find('MenuMenu');

    // Assert
    expect(output.children().length).toBe(4);
    expect(output.find('MenuItem').length).toBe(2);
    expect(output.find('NavLink').length).toBe(2);
  });

  it('renders components get correct props', () => {
    // Arrange
    const menuItems = generateItems();

    // Act
    const output = shallowRender('expectedTitle', menuItems).find('MenuMenu');

    // Assert
    menuItems.forEach(({ Component, props, children }, index) => {
      const renderedProps = output.childAt(index).props();
      const actualKeys = Object.keys(props);

      actualKeys.forEach(key => expect(renderedProps[key]).toBe(props[key]));
    });
  });

  it('renders components has correct children', () => {
    // Arrange
    const menuItems = generateItems();

    // Act
    const output = shallowRender('expectedTitle', menuItems).find('MenuMenu');

    // Assert
    menuItems.forEach(({ Component, props, children }, index) => {
      const renderedProps = output.childAt(index).props();

      expect(renderedProps.children).toBe(children);
    });
  });
});
