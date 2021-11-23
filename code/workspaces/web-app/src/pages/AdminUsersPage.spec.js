import React from 'react';
import { render } from '@testing-library/react';
import AdminUsersPage from './AdminUsersPage';

jest.mock('../containers/adminListUsers/AdminUsersContainer', () => () => (<div>AdminUsersContainer mock</div>));
jest.mock('../components/app/Footer', () => () => (<div>Footer mock</div>));

it('AdminUsersPage renders correct snapshot', () => {
  expect(render(<AdminUsersPage/>).container).toMatchSnapshot();
});
