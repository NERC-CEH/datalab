import React from 'react';
import { useDispatch } from 'react-redux';
import { render } from '../../testUtils/renderTests';
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
jest.mock('../../api/projectSettingsService');

jest.mock('./RemoveUserDialog', () => props => (<div>RemoveUserDialog mock {JSON.stringify(props)}</div>));
jest.mock('./UserPermissionsTableActionCells', () => ({
  CheckboxCell: props => (<td>CheckboxCell mock {JSON.stringify(props)}</td>),
  RemoveUserButtonCell: props => (<td>RemoveUserButtonCell mock {JSON.stringify(props)}</td>),
}));

describe('UserPermissionsTable', () => {
  beforeEach(() => {
    const dispatchMock = jest.fn().mockName('dispatch');
    useDispatch.mockReturnValue(dispatchMock);

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
    useProjectUsers.mockReturnValue(initialUsers);
    useCurrentUserId.mockReturnValue('current-user-id');
    useCurrentUserSystemAdmin.mockReturnValue('current-user-system-admin');
    useCurrentProjectKey.mockReturnValue({ value: 'testproj' });
  });

  it('renders pure component with correct props', () => {
    expect(render(<UserPermissionsTable />).container).toMatchSnapshot();
  });
});

describe('PureUserPermissionsTable', () => {
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
      render(
        <PureUserPermissionsTable
          users={initialUsers}
          classes={classes}
          colHeadings={columnHeadings}
        />,
      ).container,
    ).toMatchSnapshot();
  });
});

describe('UserPermissionsTableBody', () => {
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
        render(
          <table>
            <tbody>
            <UserPermissionsTableBody
              users={users}
              classes={classes}
              colHeadings={columnHeadings}
              numCols={columnHeadings.length}
            />
            </tbody>
          </table>
          ,
        ).getByRole('row'),
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
        render(
          <table>
            <tbody>
          <UserPermissionsTableBody
            users={users}
            classes={classes}
            colHeadings={columnHeadings}
            numCols={columnHeadings.length}
          />
          </tbody>
          </table>,
        ).getByRole('row'),
      ).toMatchSnapshot();
    });
  });

  describe('when there are users', () => {
    const users = {
      ...initialUsers,
      value: [
        { name: 'admin name', userId: 'admin-user-id', role: 'admin', verified: true },
        { name: 'user name', userId: 'user-user-id', role: 'user', verified: true },
        { name: 'viewer name', userId: 'viewer-user-id', role: 'viewer', verified: true },
        { name: 'unverified viewer name', userId: 'unverified-viewer-user-id', role: 'viewer', verified: false },
      ],
    };

    it('correctly renders row for each user', () => {
      expect(
        render(
          <table>
            <tbody>
          <UserPermissionsTableBody
            users={users}
            currentUserId="admin-user-id"
            projectKey="projectKey"
            classes={classes}
            colHeadings={columnHeadings}
            numCols={columnHeadings.length}
            setRemoveUserDialogState={jest.fn()}
            dispatch={jest.fn()}
          />
          </tbody>
          </table>,
        ).container,
      ).toMatchSnapshot();
    });
  });
});

describe('FullWidthRow', () => {
  it('returns a table row with correct colSpan and content', () => {
    expect(
      render(
        <table>
            <tbody>
        <FullWidthRow numCols={4}>
          <div>row content</div>
        </FullWidthRow>
        </tbody>
          </table>,
      ).container,
    ).toMatchSnapshot();
  });
});

describe('FullWidthTextRow', () => {
  it('returns a table row with correct colSpan and text wrapped in Typography', () => {
    expect(
      render(
        <table>
          <tbody>
            <FullWidthTextRow numCols={4}>{'Text to go in row.'}</FullWidthTextRow>
          </tbody>
        </table>,
      ).container,
    ).toMatchSnapshot();
  });
});

describe('UserPermissionsTableRow', () => {
  const classes = {
    activeSelection: 'activeSelection',
    implicitSelection: 'implicitSelection',
    tableCell: 'tableCell',
  };

  describe('for a given user', () => {
    const user = { name: 'admin name', role: 'admin', verified: true };

    it('correctly renders passing props to children when not current user', () => {
      expect(
        render(
          <table>
            <tbody>
              <UserPermissionsTableRow
                user={user}
                isCurrentUser={false}
                index={2}
                projectKey="projectKey"
                classes={classes}
                setRemoveUserDialogState={jest.fn()}
                dispatch={jest.fn()}
              />
            </tbody>
          </table>,
        ).container,
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

  it('renders correct header bar based on column headings', () => {
    expect(
      render(
        <table>
          <tbody>
            <UserPermissionsTableHead headings={headings} classes={classes} />
          </tbody>
        </table>,
      ).container,
    ).toMatchSnapshot();
  });
});

describe('dispatchAddUserPermissions', () => {
  it('dispatches correctly configured remove user permissions action', () => {
    projectSettingsActions.addUserPermission = jest.fn();
    projectSettingsActions.addUserPermission.mockReturnValue('expected-result');

    const projectKey = 'project';
    const user = { name: 'User One', userId: 'user-one-id', verified: true };
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
    const user = { name: 'User One', userId: 'user-one-id', verified: true };
    const mockDispatch = jest.fn();

    dispatchRemoveUserPermissions(projectKey, user, mockDispatch);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith('expected-result');

    expect(projectSettingsActions.removeUserPermission).toHaveBeenCalledTimes(1);
    expect(projectSettingsActions.removeUserPermission)
      .toHaveBeenCalledWith(projectKey, user);
  });
});
