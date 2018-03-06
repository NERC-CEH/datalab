import React from 'react';
import { mount, shallow } from 'enzyme';
import createStore from 'redux-mock-store';
import auth from '../../auth/auth';
import RequireAuth, { PureRequireAuth } from './RequireAuth';

jest.mock('../../auth/auth');
const isAuthenticatedMock = jest.fn();
const getCurrentSessionMock = jest.fn();
auth.isAuthenticated = isAuthenticatedMock;
auth.getCurrentSession = getCurrentSessionMock;

describe('RequireAuth', () => {
  describe('is a connected component which', () => {
    function shallowRenderConnected(store) {
      const props = {
        store,
        PrivateComponent: () => {},
        PublicComponent: () => {},
      };

      return shallow(<RequireAuth {...props} />);
    }

    it('extracts the correct props from the redux state', () => {
      // Arrange
      const tokens = { token: 'expectedUserToken' };
      const store = createStore()({
        authentication: { tokens },
      });

      // Act
      const output = shallowRenderConnected(store);

      // Assert
      expect(output.prop('tokens')).toBe(tokens);
      expect(Object.keys(output.prop('actions')))
        .toEqual(['userLogsIn', 'getUserPermissions']);
    });

    it('userLogsIn function dispatches correct action', () => {
      // Arrange
      const store = createStore()({
        authentication: { tokens: {} },
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
      actions: { userLogsIn: () => {}, getUserPermissions: () => {} },
    });

    beforeEach(() => jest.resetAllMocks());

    it('calls auth.getCurrentSession when mounted', () => {
      // Arrange
      const props = generateProps();

      // Act
      shallowRenderPure(props);

      // Assert
      expect(getCurrentSessionMock).toHaveBeenCalledTimes(1);
    });

    it('renders private content if user is logged in', () => {
      // Arrange
      const props = generateProps();
      isAuthenticatedMock.mockReturnValue(true);

      // Act
      const output = shallowRenderPure(props).find('Route').prop('render');

      // Arrange
      expect(mount(output()).find('span')).toHaveText('expectedPrivateComponent');
    });

    it('renders public content if user is not logged in', () => {
      // Arrange
      const props = generateProps();
      props.tokens = {};

      // Act
      const output = shallowRenderPure(props).find('Route').prop('render');

      // Arrange
      expect(mount(output()).find('span')).toHaveText('expectedPublicComponent');
    });

    it('passes Route component props down to the rendered child', () => {
      // Arrange
      const props = generateProps();

      // Act
      const output = shallowRenderPure(props).find('Route');

      // Arrange
      expect(output).toHaveProp('path');
      expect(output).toHaveProp('exact');
      expect(output).toHaveProp('strict');
    });
  });
});
