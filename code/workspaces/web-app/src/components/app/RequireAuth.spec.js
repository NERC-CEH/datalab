import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import createStore from 'redux-mock-store';
import CircularProgress from '@material-ui/core/CircularProgress';
import getAuth from '../../auth/auth';
import RequireAuth, { PureRequireAuth } from './RequireAuth';

jest.mock('../../auth/auth');
const isAuthenticated = jest.fn();
const getCurrentSession = jest.fn();
getAuth.mockImplementation(() => ({
  isAuthenticated,
  getCurrentSession,
}));

describe('RequireAuth', () => {
  let shallow;
  let mount;

  beforeEach(() => {
    shallow = createShallow();
    mount = createMount();
  });

  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        PrivateComponent: () => {},
        PublicComponent: () => {},
      };
      // need to dive through the with styles;
      return shallow(<RequireAuth {...props} />).dive().dive().find('RequireAuth');
    }

    it('extracts the correct props from the redux state', () => {
      // Arrange
      const tokens = { token: 'expectedUserToken' };
      const permissions = { fetching: false, value: ['permission'] };
      const store = createStore()({
        authentication: { tokens, permissions },
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(output.prop('tokens')).toBe(tokens);
      expect(output.prop('permissions')).toBe(permissions);
      expect(Object.keys(output.prop('actions')))
        .toEqual(['userLogsIn', 'getUserPermissions']);
    });

    it('userLogsIn function dispatches correct action', () => {
      // Arrange
      const store = createStore()({
        authentication: { tokens: {}, permissions: { fetching: true, value: [] } },
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(store.getActions().length).toBe(0);
      output.prop('actions').userLogsIn({ expected: 'currentSession' });
      expect(store.getActions()[0]).toEqual({
        type: 'USER_LOGIN_ACTION',
        payload: { expected: 'currentSession' },
      });
    });
  });

  describe('is a container which', () => {
    function shallowRenderPure({ PrivateComponent = () => {}, ...rest }) {
      return shallow(<PureRequireAuth PrivateComponent={PrivateComponent} {...rest } />);
    }

    const expectedPrivateComponent = () => (<span>expectedPrivateComponent</span>);
    const expectedPublicComponent = () => (<span>expectedPublicComponent</span>);

    const generateProps = () => ({
      PrivateComponent: expectedPrivateComponent,
      PublicComponent: expectedPublicComponent,
      tokens: { token: 'expectedUserToken' },
      permissions: { fetching: false, value: ['expectedPermission'] },
      actions: { userLogsIn: () => {}, getUserPermissions: () => {} },
      classes: { circularProgress: 'circularProgress' },
    });

    beforeEach(() => jest.clearAllMocks());

    it('calls auth.getCurrentSession when mounted', () => {
      // Arrange
      const props = generateProps();

      // Act
      shallowRenderPure(props);

      // Assert
      expect(getCurrentSession).toHaveBeenCalledTimes(1);
    });

    it('renders private content if user is logged in', () => {
      // Arrange
      const props = generateProps();
      isAuthenticated.mockReturnValue(true);

      // Act
      const output = shallowRenderPure(props).find('Route').prop('render');

      // Arrange
      expect(mount(output()).find('span')).toHaveText('expectedPrivateComponent');
    });

    it('passes permissions to PrivateComponent', () => {
      // Arrange
      const props = generateProps();

      // Act
      const output = shallowRenderPure(props).find('Route').prop('render');

      // Assert
      expect(mount(output()).prop('promisedUserPermissions')).toEqual({
        fetching: false,
        value: ['expectedPermission'],
      });
    });

    it('renders public content if user is not logged in', () => {
      // Arrange
      const props = generateProps();
      props.tokens = {};

      // Act
      const output = shallowRenderPure(props).find('Route').prop('render');

      // Assert
      expect(mount(output()).find('span')).toHaveText('expectedPublicComponent');
    });

    it('passes Route component props down to the rendered child', () => {
      // Arrange
      const props = generateProps();

      // Act
      const output = shallowRenderPure(props).find('Route');

      // Assert
      expect(output).toHaveProp('path');
      expect(output).toHaveProp('exact');
      expect(output).toHaveProp('strict');
    });

    it('renders spinner while permission are retrieved', () => {
      // Arrange
      const props = generateProps();
      props.permissions.fetching = true;

      // Act
      const output = shallowRenderPure(props).find('Route').prop('render');

      // Assert
      expect(mount(output()).type()).toEqual(CircularProgress);
    });
  });
});
