import React from 'react';
import { MemoryRouter, Route, useHistory, useLocation } from 'react-router-dom';
import { render } from '../../testUtils/renderTests';
import RoutePermissions from './RoutePermissionWrapper';
import { useCurrentUserPermissions } from '../../hooks/authHooks';

jest.mock('../../hooks/authHooks');

describe('RoutePermissionWrapper', () => {
  function shallowRender(props) {
    return render(
      <MemoryRouter initialEntries={[props.path]} >
        <RoutePermissions {...props} />
      </MemoryRouter>,
    ).container;
  }

  function fullRender(props) {
    let testHistory = null;
    let testLocation = null;

    const LocationAndHistoryUpdater = () => {
      testHistory = useHistory();
      testLocation = useLocation();
      return null;
    };

    const wrapper = render(
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
    useCurrentUserPermissions.mockReturnValueOnce({
      error: null,
      fetching: true,
      value: [],
    });
    const props = generateProps();

    const { wrapper } = fullRender(props);
    expect(wrapper.getByRole('progressbar')).not.toBeNull();
  });

  it('renders given component when permissions match', () => {
    useCurrentUserPermissions.mockReturnValueOnce({
      error: null,
      fetching: false,
      value: ['expectedPermission'],
    });
    const props = generateProps();

    const { wrapper } = fullRender(props);
    expect(wrapper.getByText('Has Permission')).not.toBeNull();
  });

  it('renders given component when instance admin', () => {
    useCurrentUserPermissions.mockReturnValueOnce({
      error: null,
      fetching: false,
      value: ['system:instance:admin'],
    });
    const props = generateProps();

    const { wrapper } = fullRender(props);
    expect(wrapper.getByText('Has Permission')).not.toBeNull();
  });

  it('renders given component when no permissions required', () => {
    useCurrentUserPermissions.mockReturnValueOnce({
      error: null,
      fetching: false,
      value: ['expectedPermission'],
    });
    const props = generateProps();
    props.permission = '';

    const { wrapper, testLocation: { pathname } } = fullRender(props);
    expect(wrapper.getByText('Has Permission')).not.toBeNull();
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
    useCurrentUserPermissions.mockReturnValueOnce({
      error: null,
      fetching: false,
      value: ['notMatchingPermission'],
    });
    const props = generateProps();

    const { wrapper, testLocation: { pathname } } = fullRender(props);

    expect(wrapper.queryByText('Has Permission')).toBeNull();
    expect(wrapper.getByText('Missing Permission')).not.toBeNull();
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
    expect(wrapper.container.firstChild).toBeNull();
    expect(pathname).toEqual(props.path);
  });
});
