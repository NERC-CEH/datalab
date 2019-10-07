import React from 'react';
import { shallow } from 'enzyme';
import ProjectNavigationContainer from './ProjectNavigationContainer';

describe('ProjectNavigationContainer', () => {
  it('renders correct snapshot passing props onto children', () => {
    expect(
      shallow(
        <ProjectNavigationContainer
          match={{ params: { projectKey: 'testproj' }, path: 'projectspath' }}
          promisedUserPermissions={{ value: ['userPermissions'], fetching: false }}
        />,
      ),
    ).toMatchSnapshot();
  });
});
