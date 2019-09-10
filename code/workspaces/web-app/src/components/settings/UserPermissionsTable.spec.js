import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { getTable,
  getFullWidthRow,
  getFullWidthTextRow,
  getTableRow,
  getCheckbox,
  getCheckboxCell,
  getTableHead,
  projectUsersSelector,
  PERMISSIONS,
  columnHeadings } from './UserPermissionsTable';

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

describe('getTable', () => {
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
          getTable(initialUsers, classes, columnHeadings),
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
          getTable(users, classes, columnHeadings),
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
          getTable(users, classes, columnHeadings),
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
          getTable(users, classes, columnHeadings),
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
    const userRole = 'Admin';
    const checkBox = PERMISSIONS.ADMIN;
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
    const userRole = 'Admin';
    const checkBox = PERMISSIONS.USER;
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
    const userRole = 'Viewer';
    const checkBox = PERMISSIONS.ADMIN;
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
