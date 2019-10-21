import React from 'react';
import * as ReactRedux from 'react-redux';
import { shallow } from 'enzyme';
import useCurrentProjectKey from '../../hooks/useCurrentProjectKey';
import ProjectNavigationContainer, { PureProjectNavigationContainer } from './ProjectNavigationContainer';

jest.mock('../../hooks/useCurrentProjectKey');

const testProjKey = { fetching: false, error: null, value: 'testproj' };

const dispatchMock = jest.fn().mockName('dispatch');
jest.spyOn(ReactRedux, 'useDispatch').mockImplementation(() => dispatchMock);

useCurrentProjectKey.mockReturnValue(testProjKey);

const match = { params: { projectKey: 'testproj' }, path: 'projects/:projectKey' };
const promisedUserPermissions = {
  fetching: false,
  error: null,
  value: ['projects:testproj:projects:read'],
};

describe('ProjectNavigationContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders to match snapshot passing correct project to children', () => {
    const props = { match, promisedUserPermissions };
    expect(shallow(<ProjectNavigationContainer {...props} />)).toMatchSnapshot();
  });
});

describe('PureProjectNavigationContainer', () => {
  const shallowRender = (props) => {
    const defaultProps = {
      match,
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
