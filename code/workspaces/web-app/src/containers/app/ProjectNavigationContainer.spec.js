import React from 'react';
import * as ReactRedux from 'react-redux';
import { Router } from 'react-router';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import { useCurrentUserPermissions } from '../../hooks/authHooks';
import { PureProjectNavigationContainer } from './ProjectNavigationContainer';

// jest.mock('react-router');
jest.mock('../../hooks/currentProjectHooks');
jest.mock('../../hooks/authHooks');

jest.mock('../../components/app/ProjectSideBar', () => props => (<div>ProjectSideBar mock {JSON.stringify(props)}</div>));
jest.mock('../../pages/ProjectInfoPage', () => props => (<div>ProjectInfoPage mock {JSON.stringify(props)}</div>));

const match = { params: { projectKey: 'testproj' }, path: '/projects/:projectKey' };

const testProjKey = { fetching: false, error: null, value: 'testproj' };

const promisedUserPermissions = {
  fetching: false,
  error: null,
  value: ['projects:testproj:projects:read'],
};

const history = createMemoryHistory();

describe('PureProjectNavigationContainer', () => {
  const dispatchMock = jest.fn().mockName('dispatch');
  const shallowRender = (props) => {
    const defaultProps = {
      path: match.path,
      dispatch: dispatchMock,
      projectKey: testProjKey,
      promisedUserPermissions,
    };

    const renderProps = {
      ...defaultProps,
      ...props,
    };

    history.push('/projects/testproj/info');
    return render(<Router history={history}><PureProjectNavigationContainer {...renderProps} /></Router>).container;
  };

  beforeEach(() => {
    jest.spyOn(ReactRedux, 'useDispatch').mockImplementation(() => dispatchMock);
    useCurrentProjectKey.mockReturnValue(testProjKey);
    useCurrentUserPermissions.mockReturnValue(promisedUserPermissions);
  });

  describe('should redirect if', () => {
    it('user does not have read permission on project', () => {
      const props = {
        promisedUserPermissions: {
          fetching: false,
          error: null,
          value: ['incorrect:permission'],
        },
      };
      shallowRender(props);
      expect(history.location.pathname).toEqual('/projects');
    });

    it('there is an error getting the project key', () => {
      const props = {
        projectKey: {
          fetching: false,
          error: 'An error message.',
          value: undefined,
        },
      };
      shallowRender(props);
      expect(history.location.pathname).toEqual('/projects');
    });
  });

  it('renders correct snapshot passing props onto children', () => {
    expect(shallowRender({})).toMatchSnapshot();
  });
});
