import React from 'react';
import { useDispatch } from 'react-redux';
import { createShallow } from '@material-ui/core/test-utils';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import { useUsers } from '../../hooks/usersHooks';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import { useCurrentUserId } from '../../hooks/authHooks';
import useCurrentUserSystemAdmin from '../../hooks/useCurrentUserSystemAdmin';
import projectSettingsActions from '../../actions/projectSettingsActions';
import AddUserPermission, {
  PureAddUserPermission,
  UsersAutofill,
  UsersDropdown,
  PermissionsSelector,
  AddUserButton,
  dispatchAddUserAction,
} from './AddUserPermissions';

jest.mock('react-redux');
jest.mock('../../hooks/usersHooks');
jest.mock('../../hooks/authHooks');
jest.mock('../../hooks/currentProjectHooks');
jest.mock('../../hooks/useCurrentUserSystemAdmin');

const permissionLevels = ['Admin', 'User', 'Viewer'];
const initialUsers = {
  fetching: { inProgress: false, error: false },
  updating: { inProgress: false, error: false },
  value: [
    { name: 'Test User One', userId: 'test-user-one' },
    { name: 'Test User Two', userId: 'test-user-two' },
  ],
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
  let shallow;

  const dispatchMock = jest.fn().mockName('dispatch');
  useDispatch.mockReturnValue(dispatchMock);

  useUsers.mockReturnValue('users');
  useCurrentUserId.mockReturnValue('current-user-id');
  useCurrentUserSystemAdmin.mockReturnValue('current-user-system-admin');
  useCurrentProjectKey.mockReturnValue({ value: 'testproj' });

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders pure component with correct props', () => {
    expect(shallow(<AddUserPermission />)).toMatchSnapshot();
  });
});

describe('PureAddUserPermission', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders to match snapshot', () => {
    expect(
      shallow(
        <PureAddUserPermission
          users={initialUsers}
          projectKey="projectKey"
          permissionLevels={permissionLevels}
          selectedPermissions={'Viewer'}
          setSelectedPermissions={jest.fn()}
          selectedUserName={''}
          setSelectedUserName={jest.fn()}
          dispatch={jest.fn()}
          classes={classes}
        />,
      ),
    ).toMatchSnapshot();
  });
});

describe('UsersAutofill', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  const userNames = initialUsers.value.map(user => user.name);

  it('renders to match snapshot', () => {
    expect(
      shallow(
        <UsersAutofill
          userNames={userNames}
          setSelectedUserName={jest.fn()}
          classes={classes}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('updates the selected user name', () => {
    const setSelectedUserNamesMock = jest.fn();
    shallow(
      <UsersAutofill userNames={userNames} setSelectedUserName={setSelectedUserNamesMock} classes={classes}/>,
    );

    expect(setSelectedUserNamesMock).toHaveBeenCalledTimes(1);
  });
});

describe('UsersDropdown', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
    jest.clearAllMocks();
  });

  const userNames = initialUsers.value.map(user => user.name);
  const getItemPropsMock = jest.fn();
  getItemPropsMock.mockImplementation(arg => arg);

  it('renders with correct class name when it is not open', () => {
    expect(
      shallow(
        <UsersDropdown
          isOpen={false}
          userNames={userNames}
          inputValue={''}
          getMenuProps={jest.fn()}
          getItemProps={getItemPropsMock}
          classes={classes}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('renders with correct class name when it is open', () => {
    expect(
      shallow(
        <UsersDropdown
          isOpen={true}
          userNames={userNames}
          inputValue={''}
          getMenuProps={jest.fn()}
          getItemProps={getItemPropsMock}
          classes={classes}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('renders only items containing the input value', () => {
    expect(
      shallow(
        <UsersDropdown
          isOpen={true}
          inputValue={'One'}
          userNames={userNames}
          getMenuProps={jest.fn()}
          getItemProps={getItemPropsMock}
          classes={classes}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('renders with message when there are no items matching the input value', () => {
    expect(
      shallow(
        <UsersDropdown
          isOpen={true}
          userNames={userNames}
          inputValue={'no matches to this input'}
          getMenuProps={jest.fn()}
          getItemProps={getItemPropsMock}
          classes={classes}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('calls the downshift getProps functions', () => {
    const getMenuPropsMock = jest.fn();
    shallow(
      <UsersDropdown
        isOpen={true}
        userNames={userNames}
        inputValue={''}
        getMenuProps={getMenuPropsMock}
        getItemProps={getItemPropsMock}
        classes={classes}
      />,
    );

    expect(getMenuPropsMock).toHaveBeenCalledTimes(1);
    expect(getItemPropsMock).toHaveBeenCalledTimes(userNames.length);
  });
});

describe('PermissionsSelector', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders to match snapshot', () => {
    expect(
      shallow(
        <PermissionsSelector
          permissionLevels={permissionLevels}
          selectedPermissions={'Viewer'}
          setSelectedPermissions={jest.fn()}
          classes={classes}
        />,
      ),
    ).toMatchSnapshot();
  });
});

describe('AddUserButton', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders as disabled with explanatory tooltip when the selected user name is not in the list of possibilities', () => {
    expect(
      shallow(
        <AddUserButton
          userInformation={initialUsers.value}
          selectedUserName={'not a user name'}
          project={'project'}
          selectedPermissions={permissionLevels[0]}
          onClickFn={jest.fn()}
          classes={classes}
        />,
      ),
    ).toMatchSnapshot();
  });

  describe('when selected user is the current user', () => {
    it('renders as not disabled when the current user is system admin', () => {
      expect(
        shallow(
          <AddUserButton
            userInformation={initialUsers.value}
            selectedUserName={initialUsers.value[0].name}
            currentUserId={initialUsers.value[0].userId}
            currentUserSystemAdmin
            project={'project'}
            selectedPermissions={permissionLevels[0]}
            onClickFn={jest.fn()}
            classes={classes}
          />,
        ),
      ).toMatchSnapshot();
    });

    it('renders as disabled with explanatory tooltip when the current user is not system admin', () => {
      expect(
        shallow(
          <AddUserButton
            userInformation={initialUsers.value}
            selectedUserName={initialUsers.value[0].name}
            currentUserId={initialUsers.value[0].userId}
            currentUserSystemAdmin={false}
            project={'project'}
            selectedPermissions={permissionLevels[0]}
            onClickFn={jest.fn()}
            classes={classes}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('when the selected user is not the current user', () => {
    it('renders as not disabled when the selected user name is in the list of possibilities', () => {
      expect(
        shallow(
          <AddUserButton
            userInformation={initialUsers.value}
            selectedUserName={initialUsers.value[0].name}
            project={'project'}
            selectedPermissions={permissionLevels[0]}
            onClickFn={jest.fn()}
            classes={classes}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  it('calls onClickFn with correct arguments when clicked', () => {
    const userInformation = initialUsers.value;
    const selectedUser = initialUsers.value[0];
    const projectKey = 'projectKey';
    const selectedPermissions = permissionLevels[0];
    const onClickFnMock = jest.fn();
    const dispatch = jest.fn();

    const render = shallow(
      <AddUserButton
        userInformation={userInformation}
        selectedUserName={selectedUser.name}
        projectKey={projectKey}
        selectedPermissions={selectedPermissions}
        onClickFn={onClickFnMock}
        dispatch={dispatch}
        classes={classes}
      />,
    );
    render.find(PrimaryActionButton).simulate('click');
    expect(onClickFnMock).toHaveBeenCalledTimes(1);
    expect(onClickFnMock)
      .toHaveBeenCalledWith(projectKey, selectedUser, selectedPermissions, dispatch);
  });
});

describe('dispatchAddUserAction', () => {
  it('dispatches the result of addUserPermission action', () => {
    const project = 'project';
    const user = initialUsers.value[0];
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
