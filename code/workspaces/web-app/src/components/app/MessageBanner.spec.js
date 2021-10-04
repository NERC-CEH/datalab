import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createShallow } from '@material-ui/core/test-utils';
import MessageBanner from './MessageBanner';

jest.mock('react-redux');
jest.mock('./Message', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>Message</>),
}));
useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));

const message1 = {
  id: 'id1',
  message: 'Test message',
  expiry: '2021-12-25',
  created: '2021-10-31',
};
const message2 = {
  id: 'id2',
  message: 'Other message',
  expiry: '2021-12-26',
  created: '2021-11-31',
};
const messages = [message1, message2];
useSelector.mockReturnValue(messages);

describe('MessageBanner', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correct snapshot', () => {
    expect(shallow(<MessageBanner/>)).toMatchSnapshot();
  });
});
