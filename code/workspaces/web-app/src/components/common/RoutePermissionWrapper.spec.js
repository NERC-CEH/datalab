import React from 'react';
import { MemoryRouter, Route, useHistory, useLocation } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import CircularProgress from '@material-ui/core/CircularProgress';
import RoutePermissions from './RoutePermissionWrapper';
import { useCurrentUserPermissions } from '../../hooks/authHooks';

jest.mock('../../hooks/authHooks');

describe('RoutePermissionWrapper', () => {
  function shallowRender(props) {
    return shallow(
      <RoutePermissions {...props} />,
    );
  }

  function fullRender(props) {
    let testHistory = null;
    let testLocation = null;

    const LocationAndHistoryUpdater = () => {
      testHistory = useHistory();
      testLocation = useLocation();
      return null;
    };

    const wrapper = mount(
      <MemoryRouter initialEntries={[props.path]} >
        <RoutePermissions {...props} />
        <Route path="*">
          <LocationAndHistoryUpdater />
        </Route>
      </MemoryRouter>,
    );

    return { wrapper, testHistory, testLocation };
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
    useCurrentUserPermissions.mockReturnValueOnce({
      error: null,
      fetching: true,
      value: [],
    });
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('renders spinner when fetching permissions', () => {
    // Arrange
    useCurrentUserPermissions.mockReturnValueOnce({
      error: null,
      fetching: true,
      value: [],
    });
    const props = generateProps();

    // Act
    const { wrapper } = fullRender(props);
    const matchingNodes = wrapper.find(CircularProgress);

    // Assert
    expect(matchingNodes.length).toBe(1);
  });

  it('renders given component when permissions match', () => {
    // Arrange
    useCurrentUserPermissions.mockReturnValueOnce({
      error: null,
      fetching: false,
      value: ['expectedPermission'],
    });
    const props = generateProps();

    // Act
    const { wrapper } = fullRender(props);
    const matchingNodes = wrapper.find('span');

    // Assert
    expect(matchingNodes.prop('children')).toBe('Has Permission');
  });

  it('renders given component when instance admin', () => {
    // Arrange
    useCurrentUserPermissions.mockReturnValueOnce({
      error: null,
      fetching: false,
      value: ['system:instance:admin'],
    });
    const props = generateProps();

    // Act
    const { wrapper } = fullRender(props);
    const matchingNodes = wrapper.find('span');

    // Assert
    expect(matchingNodes.prop('children')).toBe('Has Permission');
  });

  it('renders given component when no permissions required', () => {
    // Arrange
    useCurrentUserPermissions.mockReturnValueOnce({
      error: null,
      fetching: false,
      value: ['expectedPermission'],
    });
    const props = generateProps();
    props.permission = '';

    // Act
    const { wrapper, testLocation: { pathname } } = fullRender(props);
    const matchingNodes = wrapper.find('span');

    // Assert
    expect(matchingNodes.prop('children')).toBe('Has Permission');
    expect(pathname).toEqual(props.path);
  });

  it('redirects when permissions do not match and redirectTo supplied', () => {
    useCurrentUserPermissions.mockReturnValueOnce({
      error: null,
      fetching: false,
      value: ['notMatchingPermission'],
    });
    const redirectTo = '/redirect/to/this/path';
    const props = generateProps({ redirectTo });

    const { testLocation: { pathname } } = fullRender(props);

    expect(pathname).not.toEqual(props.path);
    expect(pathname).toEqual(redirectTo);
  });

  it('renders alt component when permissions do not match', () => {
    // Arrange
    useCurrentUserPermissions.mockReturnValueOnce({
      error: null,
      fetching: false,
      value: ['notMatchingPermission'],
    });
    const props = generateProps();

    // Act
    const { wrapper, testLocation: { pathname } } = fullRender(props);
    const matchingNodes = wrapper.find('span');

    // Assert
    expect(matchingNodes.prop('children')).toBe('Missing Permission');
    expect(pathname).toEqual(props.path);
  });

  it('empty render when permissions do not match and no alt component is given', () => {
    // Arrange
    useCurrentUserPermissions.mockReturnValueOnce({
      error: null,
      fetching: false,
      value: ['notMatchingPermission'],
    });
    const props = generateProps({ alt: undefined });

    // Act
    const { wrapper, testLocation: { pathname } } = fullRender(props);
    const matchingNodes = wrapper.children();

    // Assert
    expect(matchingNodes.isEmptyRender()).toBe(true);
    expect(pathname).toEqual(props.path);
  });
});
