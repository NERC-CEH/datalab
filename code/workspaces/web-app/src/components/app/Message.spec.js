import React from 'react';
import { useDispatch } from 'react-redux';
import { createShallow } from '@material-ui/core/test-utils';
import Message from './Message';

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>React Markdown</>),
}));

jest.mock('react-redux');
useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));

describe('Message', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correct snapshot', () => {
    const message = {
      id: 'id1',
      message: 'Test message',
      expiry: '2021-12-25',
      created: '2021-10-31',
    };
    expect(shallow(<Message message={message} />)).toMatchSnapshot();
  });
});
