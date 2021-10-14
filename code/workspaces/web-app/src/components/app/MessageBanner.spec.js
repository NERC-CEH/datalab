import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { render } from '@testing-library/react';
import MessageBanner from './MessageBanner';
import Message from './Message';

jest.mock('react-redux');
jest.mock('./Message', () => jest.fn(() => (<>Message</>)));

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
  it('renders correct snapshot', () => {
    const wrapper = render(<MessageBanner/>);
    expect(wrapper.container).toMatchSnapshot();

    expect(Message).toHaveBeenCalledTimes(2);
    expect(Message).toHaveBeenCalledWith({ message: message1 }, {});
    expect(Message).toHaveBeenCalledWith({ message: message2 }, {});
  });
});
