import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from 'enzyme';
import AdminUsersContainer from './AdminUsersContainer';
import { useUsers } from '../../hooks/usersHooks';
import { useRoles } from '../../hooks/rolesHooks';
import { useStacksArray } from '../../hooks/stacksHooks';
import { useDataStorageArray } from '../../hooks/dataStorageHooks';
import { useProjectsArray } from '../../hooks/projectsHooks';

jest.mock('react-redux');
jest.mock('../../hooks/usersHooks');
jest.mock('../../hooks/rolesHooks');
jest.mock('../../hooks/stacksHooks');
jest.mock('../../hooks/dataStorageHooks');
jest.mock('../../hooks/projectsHooks');
jest.mock('./UserResources', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>user resources</>),
}));

const user1 = { userId: 'user1', name: 'Test User 1' };
const user2 = { userId: 'user2', name: 'Test User 2' };
const users = [
  user1,
  user2,
];
const roles = [
  { ...user1, instanceAdmin: true },
  { ...user2, instanceAdmin: false },
];

useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));

useUsers.mockReturnValue({ fetching: false, value: users });
useRoles.mockReturnValue({ fetching: false, value: roles });
useStacksArray.mockReturnValue({ fetching: false, value: [] });
useDataStorageArray.mockReturnValue({ fetching: false, value: [] });
useProjectsArray.mockReturnValue({ fetching: false, value: [] });

describe('AdminUsersContainer', () => {
  it('renders correctly passing correct props to children', () => {
    expect(shallow(<AdminUsersContainer/>)).toMatchSnapshot();
  });
});
