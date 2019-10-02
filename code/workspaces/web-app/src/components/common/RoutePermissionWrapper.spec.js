import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import CircularProgress from '@material-ui/core/CircularProgress';
import RoutePermissions from './RoutePermissionWrapper';

describe('RoutePermissionWrapper', () => {
  function shallowRender(props) {
    return shallow(
      <RoutePermissions {...props} />,
    );
  }

  function fullRender(props) {
    return mount(
      <MemoryRouter initialEntries={[props.path]} >
        <RoutePermissions {...props} />
      </MemoryRouter>,
    );
  }

  const generateProps = props => ({
    path: '/',
    exact: true,
    component: () => (<span>Has Permission</span>),
    alt: () => (<span>Missing Permission</span>),
    permission: 'expectedPermission',
    ...props,
  });

  it('render correct snapshot', () => {
    // Arrange
    const promisedUserPermissions = {
      error: null,
      fetching: true,
      value: [],
    };
    const props = generateProps({ promisedUserPermissions });

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('renders spinner when fetching permissions', () => {
    // Arrange
    const promisedUserPermissions = {
      error: null,
      fetching: true,
      value: [],
    };
    const props = generateProps({ promisedUserPermissions });

    // Act
    const output = fullRender(props).find(CircularProgress);

    // Assert
    expect(output.length).toBe(1);
  });

  it('renders given component when permissions match', () => {
    // Arrange
    const promisedUserPermissions = {
      error: null,
      fetching: false,
      value: ['expectedPermission'],
    };
    const props = generateProps({ promisedUserPermissions });

    // Act
    const output = fullRender(props).find('span');

    // Assert
    expect(output.prop('children')).toBe('Has Permission');
  });

  it('renders given component when instance admin', () => {
    // Arrange
    const promisedUserPermissions = {
      error: null,
      fetching: false,
      value: ['system:instance:admin'],
    };
    const props = generateProps({ promisedUserPermissions });

    // Act
    const output = fullRender(props).find('span');

    // Assert
    expect(output.prop('children')).toBe('Has Permission');
  });

  it('renders given component when no permissions required', () => {
    // Arrange
    const promisedUserPermissions = {
      error: null,
      fetching: false,
      value: ['expectedPermission'],
    };
    const props = generateProps({ promisedUserPermissions });
    props.permission = '';

    // Act
    const output = fullRender(props).find('span');

    // Assert
    expect(output.prop('children')).toBe('Has Permission');
  });

  it('renders alt component when permissions do not match', () => {
    // Arrange
    const promisedUserPermissions = {
      error: null,
      fetching: false,
      value: ['notMatchingPermission'],
    };
    const props = generateProps({ promisedUserPermissions });

    // Act
    const output = fullRender(props).find('span');

    // Assert
    expect(output.prop('children')).toBe('Missing Permission');
  });

  it('empty render when permissions do not match and no alt component is given', () => {
    // Arrange
    const promisedUserPermissions = {
      error: null,
      fetching: false,
      value: ['notMatchingPermission'],
    };
    const props = generateProps({ promisedUserPermissions, alt: undefined });

    // Act
    const output = fullRender(props).children();

    // Assert
    expect(output.isEmptyRender()).toBe(true);
  });
});
