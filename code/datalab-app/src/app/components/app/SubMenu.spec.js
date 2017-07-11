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
    [Menu.Item, { expectedProps: 'firstExpectedProps' }, 'firstExpectedChildren'],
    [Menu.Item, { expectedProps: 'secondExpectedProps' }, 'secondExpectedChildren'],
    [NavLink, { to: '/', expectedProps: 'thirdExpectedProps' }, 'thirdExpectedChildren'],
    [NavLink, { to: '/', expectedProps: 'fourthExpectedProps' }, 'fourthExpectedChildren'],
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
    menuItems.forEach(([Component, props, children], index) => {
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
    menuItems.forEach(([Component, props, children], index) => {
      const renderedProps = output.childAt(index).props();

      expect(renderedProps.children).toBe(children);
    });
  });
});
