import React from 'react';
import { permissionTypes } from 'common';
import {
  renderWithState,
  buildDefaultTestState,
} from '../../testUtils/renderWithState';
import ProjectSideBar from './ProjectSideBar';
import projectSettingsActions from '../../actions/projectSettingsActions';

jest.mock('./ProjectSwitcher', () => () => <div>Project Switcher Mock</div>);
jest.mock('./SideBarButton', () => props => <div {...props}>{props.label}</div>);
jest.mock('../../actions/projectSettingsActions');

const { PROJECT_NAMESPACE } = permissionTypes;

describe('SideBar', () => {
  let state;
  let props;

  beforeEach(() => {
    projectSettingsActions.getProjectUserPermissions.mockReturnValue({ type: 'TEST_GET_PROJECT_USER_PERMISSIONS' });

    state = buildDefaultTestState();
    state.currentProject = {
      value: {
        key: 'project99',
      },
    };

    const userPermissions = [
      `${PROJECT_NAMESPACE}:project99:storage:list`,
      `${PROJECT_NAMESPACE}:project99:stacks:list`,
      `${PROJECT_NAMESPACE}:project99:settings:list`,
      `${PROJECT_NAMESPACE}:project99:clusters:list`,
    ];

    state.authentication.permissions.value = userPermissions;

    props = {
      projectKey: 'project99',
      classes: {
        itemList: 'itemList',
        sideBar: 'sideBar',
      },
    };
  });

  it('renders correctly passing props to children', () => {
    const { wrapper } = renderWithState(state, ProjectSideBar, props);
    expect(wrapper.container).toMatchSnapshot();
  });

  it('does not render menu items if loading', () => {
    state.projectUsers.fetching.inProgress = true;

    const { wrapper } = renderWithState(state, ProjectSideBar, props);
    expect(wrapper.container).toMatchSnapshot();
  });

  it('does not render settings if not admin', () => {
    state.authentication.permissions.value = [
      `${PROJECT_NAMESPACE}:project99:storage:list`,
      `${PROJECT_NAMESPACE}:project99:stacks:list`,
      `${PROJECT_NAMESPACE}:project99:clusters:list`,
    ];
    const { wrapper } = renderWithState(state, ProjectSideBar, props);
    expect(wrapper.queryByText('Settings')).toBeNull();
  });

  it('does not render analysis if viewer but still shows sites', () => {
    state.authentication.permissions.value = [
      `${PROJECT_NAMESPACE}:project99:stacks:list`,
    ];
    state.projectUsers.value[0].role = 'viewer';
    const { wrapper } = renderWithState(state, ProjectSideBar, props);
    expect(wrapper.queryByText('Analysis')).toBeNull();
    expect(wrapper.queryByText('Notebooks')).toBeNull();
    expect(wrapper.queryByText('Sites')).not.toBeNull();
  });
});
