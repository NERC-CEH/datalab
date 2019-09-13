import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { PERMISSIONS, PERMISSION_VALUES } from '../../constants/permissions';
import projectSettingsActions from '../../actions/projectSettingsActions';
import {
  PureUserPermissionsTable,
  getFullWidthRow,
  getFullWidthTextRow,
  getTableRow,
  getCheckbox,
  getCheckboxCell,
  getTableHead,
  projectUsersSelector,
  RemoveUserDialog,
  dispatchRemoveUserPermissions,
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

  describe('when there are no users', () => {
    it('renders correctly displaying there are no users', () => {
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

  describe('when there is an error', () => {
    const users = {
      ...initialUsers,
      fetching: { ...initialUsers.fetching, error: true },
    };

    it('renders correctly displaying there is an error', () => {
      expect(
        shallow(
          <PureUserPermissionsTable
            users={users}
            classes={classes}
            colHeadings={columnHeadings}
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
          <PureUserPermissionsTable
            users={users}
            classes={classes}
            colHeadings={columnHeadings}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('when there are users', () => {
    const users = {
      ...initialUsers,
      value: [
        { name: 'admin name', role: 'admin' },
        { name: 'user name', role: 'user' },
        { name: 'viewer name', role: 'viewer' },
      ],
    };

    it('renders correctly showing users and their permissions', () => {
      expect(
        shallow(
          <PureUserPermissionsTable
            users={users}
            classes={classes}
            colHeadings={columnHeadings}
          />,
        ),
      ).toMatchSnapshot();
    });
  });
});

describe('getFullWidthRow', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('returns a table row with correct colSpan and content', () => {
    expect(
      shallow(
        getFullWidthRow(<div>row content</div>, 4),
      ),
    ).toMatchSnapshot();
  });
});

describe('getFullWidthTextRow', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('returns a table row with correct colSpan and text wrapped in Typography', () => {
    expect(
      shallow(
        getFullWidthTextRow('Text to go in row.', 4),
      ),
    ).toMatchSnapshot();
  });
});

describe('getTableRow', () => {
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
    const users = [
      { name: 'admin name', role: 'admin' },
      { name: 'user name', role: 'user' },
      { name: 'viewer name', role: 'viewer' },
    ];

    it('renders correctly showing users and their permissions', () => {
      users.forEach((user, index) => {
        expect(
          shallow(
            getTableRow(user, index, classes),
          ),
        ).toMatchSnapshot();
      });
    });
  });
});

describe('when getting checkbox cells', () => {
  let shallow;

  const classes = {
    activeSelection: 'active',
    implicitSelection: 'implicit',
  };

  beforeEach(() => {
    shallow = createShallow();
  });

  describe('when user has rights equal to check box', () => {
    const userRole = PERMISSIONS.ADMIN;
    const checkBox = { name: PERMISSIONS.ADMIN, value: PERMISSION_VALUES.ADMIN };
    describe('getCheckbox', () => {
      it('returns an checked active selection check box', () => {
        expect(
          shallow(
            getCheckbox(userRole, checkBox, classes),
          ),
        ).toMatchSnapshot();
      });
    });

    describe('getCheckboxCell', () => {
      it('returns a table cell with a checked active check box inside', () => {
        expect(
          shallow(
            getCheckboxCell(userRole, checkBox, classes, 'key'),
          ),
        ).toMatchSnapshot();
      });
    });
  });

  describe('when user has rights greater than check box', () => {
    const userRole = PERMISSIONS.ADMIN;
    const checkBox = { name: PERMISSIONS.USER, value: PERMISSION_VALUES.USER };
    describe('getCheckbox', () => {
      it('returns a check implicit selection check box', () => {
        expect(
          shallow(
            getCheckbox(userRole, checkBox, classes),
          ),
        ).toMatchSnapshot();
      });
    });

    describe('getCheckboxCell', () => {
      it('returns a table cell with a checked implicit selection check box inside', () => {
        expect(
          shallow(
            getCheckboxCell(userRole, checkBox, classes, 'key'),
          ),
        ).toMatchSnapshot();
      });
    });
  });

  describe('when user has rights less than check box', () => {
    const userRole = PERMISSIONS.VIEWER;
    const checkBox = { name: PERMISSIONS.ADMIN, value: PERMISSION_VALUES.ADMIN };
    describe('getCheckbox', () => {
      it('returns an unchecked check box', () => {
        expect(
          shallow(
            getCheckbox(userRole, checkBox, classes),
          ),
        ).toMatchSnapshot();
      });
    });

    describe('getCheckboxCell', () => {
      it('returns a table cell with an unchecked check box inside', () => {
        expect(
          shallow(
            getCheckboxCell(userRole, checkBox, classes, 'key'),
          ),
        ).toMatchSnapshot();
      });
    });
  });
});

describe('getTableHead', () => {
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
        getTableHead(headings, classes),
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
