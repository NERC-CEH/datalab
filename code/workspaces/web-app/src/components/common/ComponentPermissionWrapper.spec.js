import React from 'react';
import { shallow } from 'enzyme';
import PermissionWrapper from './ComponentPermissionWrapper';

describe('ComponentPermissionWrapper', () => {
  function shallowRender(props) {
    return shallow(
      <PermissionWrapper {...props}>
        <span>Has Permission</span>
      </PermissionWrapper>,
    );
  }

  it('renders children if user has expected permission', () => {
    // Arrange
    const props = {
      userPermissions: ['expected-permission', 'another-permission'],
      permission: 'expected-permission',
    };

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output.children().length).toBe(1);
    expect(output.childAt(0).type()).toBe('span');
    expect(output.childAt(0).prop('children')).toBe('Has Permission');
  });

  it('renders children if user has instance admin permission', () => {
    // Arrange
    const props = {
      userPermissions: ['system:instance:admin'],
      permission: 'expected-permission',
    };

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output.children().length).toBe(1);
    expect(output.childAt(0).type()).toBe('span');
    expect(output.childAt(0).prop('children')).toBe('Has Permission');
  });

  it('renders null if permissions do not match', () => {
    // Arrange
    const props = {
      userPermissions: ['not-matching-permission', 'another-permission'],
      permission: 'expected-permission',
    };

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output.children().length).toBe(0);
  });
});
