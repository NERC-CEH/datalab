import React from 'react';
import * as ReactRedux from 'react-redux';
import { useParams, useRouteMatch } from 'react-router';
import { shallow } from 'enzyme';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import { useCurrentUserPermissions } from '../../hooks/authHooks';
import ProjectNavigationContainer, { PureProjectNavigationContainer } from './ProjectNavigationContainer';

jest.mock('react-router');
jest.mock('../../hooks/currentProjectHooks');
jest.mock('../../hooks/authHooks');

const match = { params: { projectKey: 'testproj' }, path: 'projects/:projectKey' };

const testProjKey = { fetching: false, error: null, value: 'testproj' };

const promisedUserPermissions = {
  fetching: false,
  error: null,
  value: ['projects:testproj:projects:read'],
};

describe('ProjectNavigationContainer', () => {
  beforeEach(() => {
    const dispatchMock = jest.fn().mockName('dispatch');
    jest.spyOn(ReactRedux, 'useDispatch').mockImplementation(() => dispatchMock);
    useParams.mockReturnValue(match.params);
    useRouteMatch.mockReturnValue(match);
    useCurrentProjectKey.mockReturnValue(testProjKey);
    useCurrentUserPermissions.mockReturnValue(promisedUserPermissions);
  });

  it('renders to match snapshot passing correct project to children', () => {
    expect(shallow(<ProjectNavigationContainer />)).toMatchSnapshot();
  });
});

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

    return shallow(<PureProjectNavigationContainer {...renderProps} />);
  };

  beforeEach(() => {
    jest.spyOn(ReactRedux, 'useDispatch').mockImplementation(() => dispatchMock);
    useParams.mockReturnValue(match.params);
    useRouteMatch.mockReturnValue(match);
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
      expect(shallowRender(props)).toMatchSnapshot();
    });

    it('there is an error getting the project key', () => {
      const props = {
        projectKey: {
          fetching: false,
          error: 'An error message.',
          value: undefined,
        },
      };
      expect(shallowRender(props)).toMatchSnapshot();
    });
  });

  it('renders correct snapshot passing props onto children', () => {
    expect(shallowRender({})).toMatchSnapshot();
  });
});
