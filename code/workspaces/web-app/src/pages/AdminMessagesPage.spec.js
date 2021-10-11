import React from 'react';
import { render } from '@testing-library/react';
import AdminMessagesPage from './AdminMessagesPage';

jest.mock('../containers/adminMessages/AdminMessagesContainer', () => () => (<>AdminMessagesContainer</>));

const userPermissions = ['expectedPermission'];

it('AdminMessagesPage renders correct snapshot', () => {
  const wrapper = render(<AdminMessagesPage userPermissions={userPermissions}/>);
  expect(wrapper.container).toMatchSnapshot();
});
