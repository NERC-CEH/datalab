import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import { PERMISSIONS, PERMISSION_VALUES } from '../../constants/permissions';
import projectSettingsActions from '../../actions/projectSettingsActions';
import {
  PureUserPermissionsTable,
  FullWidthRow,
  FullWidthTextRow,
  UserPermissionsTableRow,
  PermissionsCheckbox,
  CheckboxCell,
  UserPermissionsTableHead,
  UserPermissionsTableBody,
  projectUsersSelector,
  currentUserIdSelector,
  RemoveUserButtonCell,
  RemoveUserDialog,
  dispatchRemoveUserPermissions,
  dispatchAddUserPermissions,
  columnHeadings,
} from './UserPermissionsTable';

describe('projectUsersSelector', () => {
  const applicationState = {
    projectUsers: {
      error: null,
      fetching: false,
      value: [
        { userId: 'userId0', name: 'userName0', role: 'admin' },
        { userId: 'userId1', name: 'userName1', role: 'user' },
        { userId: 'userId2', name: 'userName2', role: 'viewer' },
      ],
    },
    anotherPartOfState: {},
  };

  it('returns correct part of application state', () => {
    expect(projectUsersSelector(applicationState)).toEqual(applicationState.projectUsers);
  });
});

describe('currentUserIdSelector', () => {
  const applicationStore = {
    authentication: {
      permissions: 'permissions',
      tokens: 'tokens',
      identity: {
        sub: 'expected-user-id',
        name: 'name',
        nickname: 'nickname',
        picture: 'picture-url',
      },
    },
  };

  it('extracts the right value from state', () => {
    expect(currentUserIdSelector(applicationStore)).toEqual('expected-user-id');
  });
});

describe('PureUserPermissionsTable', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  const classes = {
    activeSelection: 'activeSelection',
    implicitSelection: 'implicitSelection',
    tableHeader: 'tableHeader',
    tableCell: 'tableCell',
  };

  const initialUsers = {
    error: null,
    fetching: {
      inProgress: false,
      error: false,
    },
    updating: {
      inProgress: false,
      error: false,
    },
    value: [],
  };

  it('renders correctly passing props to children', () => {
    expect(
      shallow(
        <PureUserPermissionsTable
          users={initialUsers}
          classes={classes}
          colHeadings={columnHeadings}
        />,
      ),
    ).toMatchSnapshot();
  });
});

describe('UserPermissionsTableBody', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  const classes = {
    activeSelection: 'activeSelection',
    implicitSelection: 'implicitSelection',
    tableHeader: 'tableHeader',
    tableCell: 'tableCell',
  };

  const initialUsers = {
    error: null,
    fetching: {
      inProgress: false,
      error: false,
    },
    updating: {
      inProgress: false,
      error: false,
    },
    value: [],
  };

  describe('when there is an error fetching', () => {
    const users = {
      ...initialUsers,
      fetching: { ...initialUsers.fetching, error: true },
    };

    it('renders correctly displaying there is an error', () => {
      expect(
        shallow(
          <UserPermissionsTableBody
            users={users}
            classes={classes}
            colHeadings={columnHeadings}
            numCols={columnHeadings.length}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('when fetching data', () => {
    const users = {
      ...initialUsers,
      fetching: { ...initialUsers.fetching, inProgress: true },
    };

    it('renders progress indicator', () => {
      expect(
        shallow(
          <UserPermissionsTableBody
            users={users}
            classes={classes}
            colHeadings={columnHeadings}
            numCols={columnHeadings.length}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('when there are users', () => {
    const users = {
      ...initialUsers,
      value: [
        { name: 'admin name', userId: 'admin-user-id', role: 'admin' },
        { name: 'user name', role: 'user' },
        { name: 'viewer name', role: 'viewer' },
      ],
    };

    it('correctly renders row for each user', () => {
      expect(
        shallow(
          <UserPermissionsTableBody
            users={users}
            currentUserId="admin-user-id"
            project="project"
            classes={classes}
            colHeadings={columnHeadings}
            numCols={columnHeadings.length}
            setRemoveUserDialogState={jest.fn()}
            dispatch={jest.fn()}
          />,
        ),
      ).toMatchSnapshot();
    });
  });
});

describe('FullWidthRow', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('returns a table row with correct colSpan and content', () => {
    expect(
      shallow(
        <FullWidthRow numCols={4}>
          <div>row content</div>
        </FullWidthRow>,
      ),
    ).toMatchSnapshot();
  });
});

describe('FullWidthTextRow', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('returns a table row with correct colSpan and text wrapped in Typography', () => {
    expect(
      shallow(
        <FullWidthTextRow numCols={4}>{'Text to go in row.'}</FullWidthTextRow>,
      ),
    ).toMatchSnapshot();
  });
});

describe('UserPermissionsTableRow', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  const classes = {
    activeSelection: 'activeSelection',
    implicitSelection: 'implicitSelection',
    tableCell: 'tableCell',
  };

  describe('for a given user', () => {
    const user = { name: 'admin name', role: 'admin' };

    it('correctly renders passing props to children when not current user', () => {
      expect(
        shallow(
          <UserPermissionsTableRow
            user={user}
            isCurrentUser={false}
            index={2}
            project="project"
            classes={classes}
            setRemoveUserDialogState={jest.fn()}
            dispatch={jest.fn()}
          />,
        ),
      ).toMatchSnapshot();
    });
  });
});

describe('CheckboxCell', () => {
  let shallow;

  const classes = {
    activeSelection: 'active',
    implicitSelection: 'implicit',
  };

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correctly passing props to PermissionsCheckbox in TableCell', () => {
    const user = { role: PERMISSIONS.ADMIN };
    const checkboxSpec = { name: PERMISSIONS.ADMIN, value: PERMISSION_VALUES.ADMIN };

    expect(
      shallow(
        <CheckboxCell
          user={user}
          isCurrentUser={false}
          checkboxSpec={checkboxSpec}
          project="project"
          classes={classes}
          cellKey="key"
          dispatch={jest.fn()}
        />,
      ),
    ).toMatchSnapshot();
  });
});

describe('PermissionsCheckbox', () => {
  let shallow;

  const classes = {
    activeSelection: 'active',
    implicitSelection: 'implicit',
  };

  beforeEach(() => {
    shallow = createShallow();
  });

  describe('when user has rights equal to CheckboxSpec', () => {
    const user = { role: PERMISSIONS.ADMIN };
    const checkboxSpec = { name: PERMISSIONS.ADMIN, value: PERMISSION_VALUES.ADMIN };
    it('returns an checked active selection check box', () => {
      expect(
        shallow(
          <PermissionsCheckbox
            user={user}
            isCurrentUser={false}
            checkboxSpec={checkboxSpec}
            project="project"
            classes={classes}
            dispatch={jest.fn()}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('when user has rights greater than CheckboxSpec', () => {
    const user = { role: PERMISSIONS.ADMIN };
    const checkboxSpec = { name: PERMISSIONS.USER, value: PERMISSION_VALUES.USER };
    it('returns an checked implicit selection check box', () => {
      expect(
        shallow(
          <PermissionsCheckbox
            user={user}
            isCurrentUser={false}
            checkboxSpec={checkboxSpec}
            project="project"
            classes={classes}
            dispatch={jest.fn()}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('when user has rights less than CheckboxSpec', () => {
    const user = { role: PERMISSIONS.VIEWER };
    const checkboxSpec = { name: PERMISSIONS.ADMIN, value: PERMISSION_VALUES.ADMIN };
    it('returns an unchecked check box', () => {
      expect(
        shallow(
          <PermissionsCheckbox
            user={user}
            isCurrentUser={false}
            checkboxSpec={checkboxSpec}
            project="project"
            classes={classes}
            dispatch={jest.fn()}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('when checkbox user is the current user', () => {
    const user = { role: PERMISSIONS.ADMIN };
    const checkboxSpec = { name: PERMISSIONS.USER, value: PERMISSION_VALUES.USER };

    it('renders with correct check status and as disabled', () => {
      expect(
        shallow(
          <PermissionsCheckbox
            user={user}
            isCurrentUser={true}
            checkboxSpec={checkboxSpec}
            project="project"
            classes={classes}
            dispatch={jest.fn()}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('when the checkbox is clicked', () => {
    const mockActions = {
      addUserPermission: jest.fn(),
    };
    mockActions.addUserPermission.mockReturnValue('expected-result');

    const mockDispatch = jest.fn();
    const project = 'project';
    const user = { name: 'User One', userId: 'user-one-id', role: PERMISSIONS.USER };
    const checkboxSpec = { name: PERMISSIONS.ADMIN, value: PERMISSION_VALUES.ADMIN };

    it('dispatches update action with correct user and new permission level', () => {
      const render = shallow(
        <PermissionsCheckbox
          user={user}
          isCurrentUser={true}
          checkboxSpec={checkboxSpec}
          project={project}
          classes={classes}
          actions={mockActions}
          dispatch={mockDispatch}
        />,
      );
      render.find(Checkbox).simulate('click');
      expect(mockActions.addUserPermission).toHaveBeenCalledTimes(1);
      expect(mockActions.addUserPermission).toHaveBeenCalledWith(project, user, checkboxSpec.name, mockDispatch);
    });
  });
});

describe('UserPermissionsTableHead', () => {
  const classes = {
    tableCell: 'tableCell',
    tableHeader: 'tableHeader',
    checkBoxCell: 'checkBoxCell',
  };

  const headings = [
    {
      heading: 'not check box',
      checkBoxCol: false,
    },
    {
      heading: 'check box col',
      checkBoxCol: true,
    },
  ];

  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correct header bar based on column headings', () => {
    expect(
      shallow(
        <UserPermissionsTableHead headings={headings} classes={classes} />,
      ),
    ).toMatchSnapshot();
  });
});

describe('RemoveUserDialog', () => {
  const classes = { dialogDeleteUserButton: 'dialogDeleteUserButton' };

  describe('when the dialog state has open equal to false', () => {
    let shallow;

    beforeEach(() => {
      shallow = createShallow();
    });

    it('renders as null', () => {
      expect(
        shallow(
          <RemoveUserDialog
            classes={classes}
            state={{ user: null, open: false }}
            setState={jest.fn()}
            onRemoveConfirmationFn={jest.fn()}
            dispatch={jest.fn()}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('when the dialog state has open equal to true and a user set', () => {
    let shallow;

    beforeEach(() => {
      shallow = createShallow();
    });

    const openState = { user: { name: 'User One', userId: 'user-one-id' }, open: true };

    it('renders to match snapshot', () => {
      expect(
        shallow(
          <RemoveUserDialog
            classes={classes}
            state={openState}
            setState={jest.fn()}
            onRemoveConfirmationFn={jest.fn()}
            dispatch={jest.fn()}
          />,
        ),
      ).toMatchSnapshot();
    });

    it('closes when the cancel button is pressed and does not call confirmation function', () => {
      const mockSetState = jest.fn();
      const mockOnRemoveConfirmationFn = jest.fn();
      const render = shallow(
        <RemoveUserDialog
          classes={classes}
          state={openState}
          setState={mockSetState}
          onRemoveConfirmationFn={mockOnRemoveConfirmationFn}
          dispatch={jest.fn()}
        />,
      );
      render.find('#cancel-button').simulate('click');

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith({ open: false, user: null });
      expect(mockOnRemoveConfirmationFn).toHaveBeenCalledTimes(0);
    });

    it('calls provided function and closes when the confirm button is pressed', () => {
      const mockSetState = jest.fn();
      const mockOnRemoveConfirmationFn = jest.fn();
      const mockDispatch = jest.fn();
      const projectName = 'project';
      const render = shallow(
        <RemoveUserDialog
          classes={classes}
          state={openState}
          setState={mockSetState}
          onRemoveConfirmationFn={mockOnRemoveConfirmationFn}
          project={projectName}
          dispatch={mockDispatch}
        />,
      );
      render.find('#confirm-button').simulate('click');

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith({ open: false, user: null });
      expect(mockOnRemoveConfirmationFn).toHaveBeenCalledTimes(1);
      expect(mockOnRemoveConfirmationFn)
        .toHaveBeenCalledWith(projectName, openState.user, mockDispatch);
    });
  });
});

describe('dispatchAddUserPermissions', () => {
  it('dispatches correctly configured remove user permissions action', () => {
    projectSettingsActions.addUserPermission = jest.fn();
    projectSettingsActions.addUserPermission.mockReturnValue('expected-result');

    const projectKey = 'project';
    const user = { name: 'User One', userId: 'user-one-id' };
    const role = PERMISSIONS.ADMIN;
    const mockDispatch = jest.fn();

    dispatchAddUserPermissions(projectKey, user, role, mockDispatch);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith('expected-result');

    expect(projectSettingsActions.addUserPermission).toHaveBeenCalledTimes(1);
    expect(projectSettingsActions.addUserPermission)
      .toHaveBeenCalledWith(projectKey, user, role);
  });
});

describe('dispatchRemoveUserPermissions', () => {
  it('dispatches correctly configured remove user permissions action', () => {
    projectSettingsActions.removeUserPermission = jest.fn();
    projectSettingsActions.removeUserPermission.mockReturnValue('expected-result');

    const projectKey = 'project';
    const user = { name: 'User One', userId: 'user-one-id' };
    const mockDispatch = jest.fn();

    dispatchRemoveUserPermissions(projectKey, user, mockDispatch);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith('expected-result');

    expect(projectSettingsActions.removeUserPermission).toHaveBeenCalledTimes(1);
    expect(projectSettingsActions.removeUserPermission)
      .toHaveBeenCalledWith(projectKey, user);
  });
});

describe('RemoveUserButtonCell', () => {
  const classes = { tableCell: 'tableCell' };
  const user = { name: 'User One', userId: 'user-one-id' };

  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders as disabled when on the row of the current user', () => {
    expect(
      shallow(
        <RemoveUserButtonCell
          user={user}
          isCurrentUser={true}
          classes={classes}
          setRemoveUserDialogState={jest.fn()}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('sets the remove user dialog state so it opens when clicked', () => {
    const mockSetRemoveUserDialogState = jest.fn();
    const render = shallow(
      <RemoveUserButtonCell
        user={user}
        isCurrentUser={true}
        classes={classes}
        setRemoveUserDialogState={mockSetRemoveUserDialogState}
      />,
    );

    render.find(IconButton).simulate('click');
    expect(mockSetRemoveUserDialogState).toHaveBeenCalledTimes(1);
    expect(mockSetRemoveUserDialogState).toHaveBeenCalledWith({ user, open: true });
  });
});
