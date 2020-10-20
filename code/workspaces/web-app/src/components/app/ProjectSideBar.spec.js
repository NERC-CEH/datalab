import React from 'react';
import { shallow } from 'enzyme';
import { permissionTypes } from 'common';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import ProjectSideBar, { PureSideBar } from './ProjectSideBar';

jest.mock('../../hooks/currentProjectHooks');

const { PROJECT_NAMESPACE } = permissionTypes;

const classes = {
  itemList: 'itemList',
  sideBar: 'sideBar',
};

const userPermissions = [
  `${PROJECT_NAMESPACE}:project99:storage:list`,
  `${PROJECT_NAMESPACE}:project99:stacks:list`,
  `${PROJECT_NAMESPACE}:project99:settings:list`,
];

const projectKey = { fetching: false, error: null, value: 'project99' };

useCurrentProjectKey.mockReturnValue(projectKey);

describe('SideBar', () => {
  it('renders correctly passing props to children', () => {
    const props = { userPermissions, projectKey, classes };
    expect(shallow(<ProjectSideBar {...props} />)).toMatchSnapshot();
  });
});

describe('PureSideBar', () => {
  it('correctly renders correct snapshot', () => {
    const props = { userPermissions, projectKey, classes };
    expect(shallow(<PureSideBar {...props} />)).toMatchSnapshot();
  });
});
