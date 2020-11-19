import React from 'react';
import { shallow } from 'enzyme';
import AdminUsersPage from './AdminUsersPage';

it('AdminUsersPage renders correct snapshot', () => {
  expect(shallow(<AdminUsersPage/>)).toMatchSnapshot();
});
