import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { render } from '@testing-library/react';
import AdminMessagesContainer from './AdminMessagesContainer';
import AdminMessage from './AdminMessage';

jest.mock('./AdminMessage', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>AdminMessage</>),
}));

jest.mock('react-redux');

const message1 = { message: 'some message', id: '1234' };
const message2 = { message: 'other message', id: '5678' };

const dispatchMock = jest.fn().mockName('dispatch');
useDispatch.mockReturnValue(dispatchMock);
useSelector.mockReturnValue([message1, message2]);

describe('AdminMessagesContainer', () => {
  it('renders correctly', () => {
    const wrapper = render(<AdminMessagesContainer />);

    expect(wrapper.container).toMatchSnapshot();

    expect(AdminMessage).toHaveBeenCalledTimes(2);
    expect(AdminMessage).toHaveBeenCalledWith({ message: message1 }, {});
    expect(AdminMessage).toHaveBeenCalledWith({ message: message2 }, {});
    expect(useDispatch).toHaveBeenCalledTimes(1);
    expect(useSelector).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledTimes(1);
  });
});
