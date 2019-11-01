import React from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { createShallow } from '@material-ui/core/test-utils';
import getAuth from '../../auth/auth';
import { useCurrentUserPermissions, useCurrentUserTokens } from '../../hooks/authHooks';
import RequireAuth, { effectFn } from './RequireAuth';
import authActions from '../../actions/authActions';

jest.mock('react-redux');
jest.mock('../../auth/auth');
jest.mock('../../hooks/authHooks');
jest.mock('../../actions/authActions');

const isAuthenticated = jest.fn();
const getCurrentSession = jest.fn();
getAuth.mockImplementation(() => ({
  isAuthenticated,
  getCurrentSession,
}));

useCurrentUserPermissions.mockReturnValue({ fetching: false, value: ['permission'] });
useCurrentUserTokens.mockReturnValue({ token: 'expectedUserToken' });

const mockDispatch = jest.fn().mockName('dispatch');
useDispatch.mockReturnValue(mockDispatch);

describe('RequireAuth', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  const shallowRender = (props = {}) => {
    const defaultProps = {
      PrivateComponent: jest.fn().mockName('privateComponent'),
      PublicComponent: jest.fn().mockName('publicComponent'),
      path: '/path',
      exact: true,
      strict: true,
    };

    return shallow(<RequireAuth {...{ ...defaultProps, ...props }} />);
  };

  it('renders passing correct props to returned component', () => {
    expect(shallowRender()).toMatchSnapshot();
  });

  describe('passes function to returned Route that renders', () => {
    const shallowRenderFn = (props = {}) => {
      const renderFn = shallowRender(props).find(Route).prop('render');
      return shallow(renderFn());
    };

    it('CircularProgress when permissions fetching', () => {
      useCurrentUserPermissions.mockReturnValueOnce({ fetching: true });
      const render = shallowRenderFn();
      expect(render).toMatchSnapshot();
    });

    it('PrivateComponent when user has tokens', () => {
      const render = shallowRenderFn({
        PrivateComponent: props => <span {...props}>PrivateComponent</span>,
      });
      expect(render).toMatchSnapshot();
    });

    it('PublicComponent when user has no tokens', () => {
      useCurrentUserTokens.mockReturnValueOnce({});
      const render = shallowRenderFn({
        PublicComponent: props => <span {...props}>PublicComponent</span>,
      });
      expect(render).toMatchSnapshot();
    });
  });
});

describe('effectFn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets currentSession', () => {
    effectFn(mockDispatch);
    expect(getAuth().getCurrentSession).toHaveBeenCalled();
  });

  it('dispatches correct actions if there is a current session', () => {
    getAuth().getCurrentSession.mockReturnValueOnce('current-session');
    authActions.userLogsIn.mockReturnValueOnce('user-logs-in');
    authActions.getUserPermissions.mockReturnValueOnce('get-user-permissions');

    effectFn(mockDispatch);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith('user-logs-in');
    expect(mockDispatch).toHaveBeenCalledWith('get-user-permissions');
  });

  it('dispatches no actions if there is no current session', () => {
    getAuth().getCurrentSession.mockReturnValueOnce(undefined);
    effectFn(mockDispatch);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
