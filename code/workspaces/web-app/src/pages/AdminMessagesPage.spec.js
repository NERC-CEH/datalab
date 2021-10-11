import React from 'react';
import { render } from '@testing-library/react';
import AdminMessagesPage from './AdminMessagesPage';

jest.mock('../containers/adminMessages/AdminMessagesContainer', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>AdminMessagesContainer</>),
}));

const userPermissions = ['expectedPermission'];

it('AdminMessagesPage renders correct snapshot', () => {
  const wrapper = render(<AdminMessagesPage userPermissions={userPermissions}/>);
  expect(wrapper.container).toMatchSnapshot();
});
