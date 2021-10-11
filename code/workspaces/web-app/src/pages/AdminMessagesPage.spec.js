import React from 'react';
import { shallow } from 'enzyme';
import AdminMessagesPage from './AdminMessagesPage';

jest.mock('../containers/adminMessages/AdminMessagesContainer', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>AdminMessagesContainer</>),
}));

const userPermissions = ['expectedPermission'];

it('AdminMessagesPage renders correct snapshot', () => {
  expect(shallow(<AdminMessagesPage userPermissions={userPermissions} />)).toMatchSnapshot();
});
