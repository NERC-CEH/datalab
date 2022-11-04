import React from 'react';
import { useDispatch } from 'react-redux';
import { render } from '../../testUtils/renderTests';
import AdminUsersContainer from './AdminUsersContainer';
import { useUsers } from '../../hooks/usersHooks';
import { useRoles } from '../../hooks/rolesHooks';
import { useStacksArray } from '../../hooks/stacksHooks';
import { useDataStorageArray } from '../../hooks/dataStorageHooks';
import { useProjectsArray } from '../../hooks/projectsHooks';
import { getCatalogue } from '../../config/catalogue';
import projectActions from '../../actions/projectActions';
import roleActions from '../../actions/roleActions';

jest.mock('react-redux');
jest.mock('../../hooks/usersHooks');
jest.mock('../../hooks/rolesHooks');
jest.mock('../../hooks/stacksHooks');
jest.mock('../../hooks/dataStorageHooks');
jest.mock('../../hooks/projectsHooks');
jest.mock('../../config/catalogue');
jest.mock('./UserResources', () => props => (<>UserResources Mock {JSON.stringify(props, null, 2)}</>));
jest.mock('../../components/common/input/UserSelect', () => props => (<>UserSelect Mock {JSON.stringify(props)}</>));

jest.mock('../../actions/projectActions');
jest.mock('../../actions/roleActions');

const user1 = { userId: 'user1', name: 'Test User 1' };
const user2 = { userId: 'user2', name: 'Test User 2' };
const users = [
  user1,
  user2,
];
const roles = [
  { ...user1, instanceAdmin: true, dataManager: true, catalogueRole: 'admin' },
  { ...user2, instanceAdmin: false, dataManager: false, catalogueRole: 'user' },
];

describe('AdminUsersContainer', () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));

    useUsers.mockReturnValue({ fetching: false, value: users });
    useRoles.mockReturnValue({ fetching: false, value: roles });
    useStacksArray.mockReturnValue({ fetching: false, value: [] });
    useDataStorageArray.mockReturnValue({ fetching: false, value: [] });
    useProjectsArray.mockReturnValue({ fetching: false, value: [] });
    useProjectsArray.mockReturnValue({ fetching: false, value: [] });
    getCatalogue.mockReturnValue({ available: true });
    projectActions.getAllProjectsAndResources = jest.fn();
    roleActions.getAllUsersAndRoles = jest.fn();
  });

  it('renders correctly passing correct props to children', () => {
    expect(render(<AdminUsersContainer/>).container).toMatchSnapshot();
  });

  it('does not render catalogue permission filters when there is no catalogue available', () => {
    getCatalogue.mockReturnValueOnce({ available: false });
    expect(render(<AdminUsersContainer/>).container).toMatchSnapshot();
  });
});
