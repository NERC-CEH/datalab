import React from 'react';
import * as ReactRedux from 'react-redux';
import { shallow } from 'enzyme';
import useShallowSelector from '../../hooks/useShallowSelector';
import projectActions from '../../actions/projectActions';
import ProjectNavigationContainer, { PureProjectNavigationContainer } from './ProjectNavigationContainer';

jest.mock('../../hooks/useShallowSelector');

describe('ProjectNavigationContainer', () => {
  const testProj = { key: 'testproj', name: 'Test Project' };

  const dispatchMock = jest.fn().mockName('dispatch');
  jest.spyOn(ReactRedux, 'useDispatch').mockImplementation(() => dispatchMock);

  useShallowSelector.mockReturnValue({ value: testProj.key, fetching: false });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders to match snapshot passing correct project to children', () => {
    const match = { params: { projectKey: 'testproj' } };
    const promisedUserPermissions = {
      fetching: false,
      error: null,
      value: ['expected:permission'],
    };
    const props = { match, promisedUserPermissions };

    expect(shallow(<ProjectNavigationContainer {...props} />)).toMatchSnapshot();
  });

  it('updates the current project if project in url does not match current project', () => {
    // Arrange
    const match = { params: { projectKey: 'newproj' } };
    const promisedUserPermissions = {
      fetching: false,
      error: null,
      value: ['expected:permission'],
    };
    const props = { match, promisedUserPermissions };

    const action = { type: 'TEST_ACTION' };
    projectActions.setCurrentProject = jest.fn(() => action);

    // Act
    shallow(<ProjectNavigationContainer {...props} />);

    // Assert
    expect(projectActions.setCurrentProject).toHaveBeenCalledTimes(1);
    expect(projectActions.setCurrentProject).toHaveBeenCalledWith('newproj');
    expect(dispatchMock).toHaveBeenCalledWith(projectActions.setCurrentProject());
  });

  it('does not update the current project if project in url matches current project', () => {
    // Arrange
    const match = { params: { projectKey: testProj.key } };
    const promisedUserPermissions = {
      fetching: false,
      error: null,
      value: ['expected:permission'],
    };
    const props = { match, promisedUserPermissions };

    shallow(<ProjectNavigationContainer {...props} />);

    const action = { type: 'TEST_ACTION' };
    projectActions.setCurrentProject = jest.fn(() => action);

    expect(projectActions.setCurrentProject).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
  });
});

describe('PureProjectNavigationContainer', () => {
  it('renders correct snapshot passing props onto children', () => {
    expect(
      shallow(
        <PureProjectNavigationContainer
          match={{ params: { projectKey: 'testproj' }, path: 'projectspath' }}
          promisedUserPermissions={{ value: ['user:permissions'], fetching: false }}
        />,
      ),
    ).toMatchSnapshot();
  });
});
