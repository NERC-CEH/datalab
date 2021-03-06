import React from 'react';
import { useDispatch } from 'react-redux';
import { createShallow } from '@material-ui/core/test-utils';
import { useProjectUsers } from '../../hooks/projectUsersHooks';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import { useCurrentUserId } from '../../hooks/authHooks';
import useCurrentUserSystemAdmin from '../../hooks/useCurrentUserSystemAdmin';
import { PERMISSIONS } from '../../constants/permissions';
import projectSettingsActions from '../../actions/projectSettingsActions';
import UserPermissionsTable, {
  PureUserPermissionsTable,
  FullWidthRow,
  FullWidthTextRow,
  UserPermissionsTableRow,
  UserPermissionsTableHead,
  UserPermissionsTableBody,
  dispatchRemoveUserPermissions,
  dispatchAddUserPermissions,
  columnHeadings,
} from './UserPermissionsTable';

jest.mock('react-redux');
jest.mock('../../hooks/projectUsersHooks');
jest.mock('../../hooks/currentProjectHooks');
jest.mock('../../hooks/authHooks');
jest.mock('../../hooks/useCurrentUserSystemAdmin');

describe('UserPermissionsTable', () => {
  let shallow;

  const dispatchMock = jest.fn().mockName('dispatch');
  useDispatch.mockReturnValue(dispatchMock);

  useProjectUsers.mockReturnValue('users');
  useCurrentUserId.mockReturnValue('current-user-id');
  useCurrentUserSystemAdmin.mockReturnValue('current-user-system-admin');
  useCurrentProjectKey.mockReturnValue({ value: 'testproj' });

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders pure component with correct props', () => {
    expect(shallow(<UserPermissionsTable />)).toMatchSnapshot();
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
        { name: 'user name', userId: 'user-user-id', role: 'user' },
        { name: 'viewer name', userId: 'viewer-user-id', role: 'viewer' },
      ],
    };

    it('correctly renders row for each user', () => {
      expect(
        shallow(
          <UserPermissionsTableBody
            users={users}
            currentUserId="admin-user-id"
            projectKey="projectKey"
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
            projectKey="projectKey"
            classes={classes}
            setRemoveUserDialogState={jest.fn()}
            dispatch={jest.fn()}
          />,
        ),
      ).toMatchSnapshot();
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
