import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import projectSettingsActions from '../../actions/projectSettingsActions';
import {
  PureAddUserPermission,
  UsersAutofill,
  UsersDropdown,
  PermissionsSelector,
  AddUserButton,
  dispatchAddUserAction,
  getUsersFromState,
} from './AddUserPermissions';

const permissionLevels = ['Admin', 'User', 'Viewer'];
const initialUsers = {
  fetching: { inProgress: false, error: false },
  updating: { inProgress: false, error: false },
  value: [
    { name: 'Test User One', userId: 'test-user-one' },
    { name: 'Test User Two', userId: 'test-user-two' },
  ],
};

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
          permissionLevels={permissionLevels}
          selectedPermissions={'Viewer'}
          setSelectedPermissions={jest.fn()}
          selectedUserName={''}
          setSelectedUserName={jest.fn()}
          dispatch={jest.fn()}
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
        />,
      ),
    ).toMatchSnapshot();
  });

  it('updates the selected user name', () => {
    const setSelectedUserNamesMock = jest.fn();
    shallow(
      <UsersAutofill userNames={userNames} setSelectedUserName={setSelectedUserNamesMock} />,
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

  it('renders to match snapshot when it is not open', () => {
    expect(
      shallow(
        <UsersDropdown
          isOpen={false}
          userNames={userNames}
          inputValue={''}
          getMenuProps={jest.fn()}
          getItemProps={getItemPropsMock}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('renders to match snapshot when it is open', () => {
    expect(
      shallow(
        <UsersDropdown
          isOpen={true}
          userNames={userNames}
          inputValue={''}
          getMenuProps={jest.fn()}
          getItemProps={getItemPropsMock}
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
        />,
      ),
    ).toMatchSnapshot();
  });

  it('renders as closed when there are no items matching the input value', () => {
    expect(
      shallow(
        <UsersDropdown
          isOpen={true}
          userNames={userNames}
          inputValue={'no matches to this input'}
          getMenuProps={jest.fn()}
          getItemProps={getItemPropsMock}
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

  it('renders as disabled when the selected user name is not in the list of possibilities', () => {
    expect(
      shallow(
        <AddUserButton
          userInformation={initialUsers.value}
          selectedUserName={'not a user name'}
          project={'project'}
          selectedPermissions={permissionLevels[0]}
          onClickFn={jest.fn()}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('renders as not disabled when the selected user name is in the list of possibilities', () => {
    expect(
      shallow(
        <AddUserButton
          userInformation={initialUsers.value}
          selectedUserName={initialUsers.value[0].name}
          project={'project'}
          selectedPermissions={permissionLevels[0]}
          onClickFn={jest.fn()}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('calls onClickFn with correct arguments when clicked', () => {
    const userInformation = initialUsers.value;
    const selectedUser = initialUsers.value[0];
    const project = 'project';
    const selectedPermissions = permissionLevels[0];
    const onClickFnMock = jest.fn();
    const dispatch = jest.fn();

    const render = shallow(
      <AddUserButton
        userInformation={userInformation}
        selectedUserName={selectedUser.name}
        project={project}
        selectedPermissions={selectedPermissions}
        onClickFn={onClickFnMock}
        dispatch={dispatch}
      />,
    );
    render.simulate('click');
    expect(onClickFnMock).toHaveBeenCalledTimes(1);
    expect(onClickFnMock)
      .toHaveBeenCalledWith(project, selectedUser, selectedPermissions, dispatch);
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

describe('getUsersFromState', () => {
  it('returns the correct part of state', () => {
    const platformUsersState = {
      fetching: false,
      error: null,
      value: [
        { name: 'Platform User One', userId: 'platform-user-one' },
        { name: 'Platform User Two', userId: 'platform-user-two' },
        { name: 'Platform User Three', userId: 'platform-user-three' },
      ],
    };

    const state = {
      users: platformUsersState,
      anotherStateItem: 'anotherStateItem',
    };

    expect(getUsersFromState(state)).toEqual(platformUsersState);
  });
});
