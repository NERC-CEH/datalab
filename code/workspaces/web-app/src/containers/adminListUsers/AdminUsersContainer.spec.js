import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from 'enzyme';
import AdminUsersContainer from './AdminUsersContainer';
import { useUsers } from '../../hooks/usersHooks';
import { useOtherUserRoles } from '../../hooks/otherUserRolesHooks';
import { useProjectsArray } from '../../hooks/projectsHooks';

jest.mock('react-redux');
jest.mock('../../hooks/usersHooks');
jest.mock('../../hooks/otherUserRolesHooks');
jest.mock('../../hooks/projectsHooks');
jest.mock('./UserResources', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>user resources</>),
}));

const user1 = { userId: 'user1', name: 'Test User 1' };
const user2 = { userId: 'user2', name: 'Test User 2' };
const roles = { instanceAdmin: true };

useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
useUsers.mockReturnValue({ fetching: false, value: [user1, user2] });
useProjectsArray.mockReturnValue({ fetching: false, value: [] });
useOtherUserRoles.mockReturnValue({ fetching: false, value: [{ user1: roles }, { user2: roles }] });

describe('AdminUsersContainer', () => {
  it('renders correctly passing correct props to children', () => {
    expect(shallow(<AdminUsersContainer/>)).toMatchSnapshot();
  });
});
