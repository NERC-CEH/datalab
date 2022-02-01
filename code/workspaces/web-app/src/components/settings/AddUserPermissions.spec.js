import React from 'react';
import { useDispatch } from 'react-redux';
import { render, fireEvent } from '../../testUtils/renderTests';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import { useCurrentUserId } from '../../hooks/authHooks';
import useCurrentUserSystemAdmin from '../../hooks/useCurrentUserSystemAdmin';
import projectSettingsActions from '../../actions/projectSettingsActions';
import AddUserPermission, {
  PureAddUserPermission,
  PermissionsSelector,
  AddUserButton,
  dispatchAddUserAction,
} from './AddUserPermissions';

jest.mock('react-redux');
jest.mock('../../hooks/usersHooks');
jest.mock('../../hooks/authHooks');
jest.mock('../../hooks/currentProjectHooks');
jest.mock('../../hooks/useCurrentUserSystemAdmin');

jest.mock('../common/input/UserSelect', () => props => (<div>UserSelect mock {JSON.stringify(props)}</div>));
jest.mock('../../api/listUsersService');

const permissionLevels = ['Admin', 'User', 'Viewer'];
const userOne = { name: 'Test User One', userId: 'test-user-one' };
const userTwo = { name: 'Test User Two', userId: 'test-user-two' };
const initialUsers = {
  fetching: { inProgress: false, error: false },
  updating: { inProgress: false, error: false },
  value: [userOne, userTwo],
};

const classes = {
  addUserPermission: 'addUserPermission',
  dropDownClosed: 'dropDownClosed',
  dropDownOpen: 'dropDownOpen',
  permissionsSelector: 'permissionsSelector',
  usersAutofill: 'usersAutofill',
  addButton: 'addButton',
};

describe('AddUserPermissions', () => {
  beforeEach(() => {
    const dispatchMock = jest.fn().mockName('dispatch');
    useDispatch.mockReturnValue(dispatchMock);

    useCurrentUserId.mockReturnValue('current-user-id');
    useCurrentUserSystemAdmin.mockReturnValue('current-user-system-admin');
    useCurrentProjectKey.mockReturnValue({ value: 'testproj' });
  });

  it('renders pure component with correct props', () => {
    expect(render(<AddUserPermission />).container).toMatchSnapshot();
  });
});

describe('PureAddUserPermission', () => {
  it('renders to match snapshot', () => {
    expect(
      render(
        <PureAddUserPermission
          projectKey="projectKey"
          permissionLevels={permissionLevels}
          selectedPermissions={'Viewer'}
          setSelectedPermissions={jest.fn().mockName('setSelectedPermissions')}
          selectedUser={userOne}
          setSelectedUser={jest.fn().mockName('setSelectedUser')}
          dispatch={jest.fn().mockName('dispatch')}
          classes={classes}
        />,
      ).container,
    ).toMatchSnapshot();
  });
});

describe('PermissionsSelector', () => {
  it('renders to match snapshot', () => {
    expect(
      render(
        <PermissionsSelector
          permissionLevels={permissionLevels}
          selectedPermissions={'Viewer'}
          setSelectedPermissions={jest.fn()}
          classes={classes}
        />,
      ).container,
    ).toMatchSnapshot();
  });
});

describe('AddUserButton', () => {
  it('renders as disabled with explanatory tooltip when the selected user name is not in the list of possibilities', () => {
    expect(
      render(
        <AddUserButton
          userInformation={initialUsers.value}
          selectedUserName={'not a user name'}
          project={'project'}
          selectedPermissions={permissionLevels[0]}
          onClickFn={jest.fn()}
          classes={classes}
        />,
      ).container,
    ).toMatchSnapshot();
  });

  describe('when selected user is the current user', () => {
    it('renders as not disabled when the current user is system admin', () => {
      const currentUser = userOne;
      expect(
        render(
          <AddUserButton
            userInformation={initialUsers.value}
            selectedUser={currentUser}
            currentUserId={currentUser.userId}
            currentUserSystemAdmin
            project={'project'}
            selectedPermissions={permissionLevels[0]}
            onClickFn={jest.fn()}
            classes={classes}
          />,
        ).container,
      ).toMatchSnapshot();
    });

    it('renders as disabled with explanatory tooltip when the current user is not system admin', () => {
      const currentUser = userOne;
      expect(
        render(
          <AddUserButton
            userInformation={initialUsers.value}
            selectedUser={currentUser}
            currentUserId={currentUser.userId}
            currentUserSystemAdmin={false}
            project={'project'}
            selectedPermissions={permissionLevels[0]}
            onClickFn={jest.fn()}
            classes={classes}
          />,
        ).container,
      ).toMatchSnapshot();
    });
  });

  describe('when the selected user is not the current user', () => {
    it('renders as not disabled when the selected user name is in the list of possibilities', () => {
      expect(
        render(
          <AddUserButton
            userInformation={initialUsers.value}
            selectedUser={userOne}
            project={'project'}
            selectedPermissions={permissionLevels[0]}
            onClickFn={jest.fn()}
            classes={classes}
          />,
        ).container,
      ).toMatchSnapshot();
    });
  });

  it('calls onClickFn with correct arguments when clicked', () => {
    const userInformation = initialUsers.value;
    const selectedUser = userOne;
    const projectKey = 'projectKey';
    const selectedPermissions = permissionLevels[0];
    const onClickFnMock = jest.fn();
    const dispatch = jest.fn();

    const wrapper = render(
      <AddUserButton
        userInformation={userInformation}
        selectedUser={selectedUser}
        projectKey={projectKey}
        selectedPermissions={selectedPermissions}
        onClickFn={onClickFnMock}
        dispatch={dispatch}
        classes={classes}
      />,
    );
    fireEvent.click(wrapper.getByText('Add'));

    expect(onClickFnMock).toHaveBeenCalledTimes(1);
    expect(onClickFnMock)
      .toHaveBeenCalledWith(projectKey, selectedUser, selectedPermissions, dispatch);
  });
});

describe('dispatchAddUserAction', () => {
  it('dispatches the result of addUserPermission action', () => {
    const project = 'project';
    const user = userOne;
    const selectedPermissions = permissionLevels[0];
    const dispatchMock = jest.fn();
    const addUserPermissionMock = jest.fn();
    addUserPermissionMock.mockReturnValue('expected-result');
    projectSettingsActions.addUserPermission = addUserPermissionMock;

    dispatchAddUserAction(project, user, selectedPermissions, dispatchMock);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith('expected-result');

    expect(projectSettingsActions.addUserPermission).toHaveBeenCalledTimes(1);
    expect(projectSettingsActions.addUserPermission)
      .toHaveBeenCalledWith(project, user, selectedPermissions.toLowerCase());
  });
});
