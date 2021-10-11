import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { render } from '@testing-library/react';
import AdminMessagesContainer, { confirmDeleteMessage, deleteMessage } from './AdminMessagesContainer';
import AdminMessage from './AdminMessage';
import notify from '../../components/common/notify';

jest.mock('./AdminMessage', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>AdminMessage</>),
}));

jest.mock('react-redux');
jest.mock('../../components/common/notify', () => ({ success: jest.fn(), error: jest.fn() }));

const message1 = { message: 'some message', id: '1234' };
const message2 = { message: 'other message', id: '5678' };

beforeEach(() => jest.clearAllMocks());

describe('AdminMessagesContainer', () => {
  const dispatchMock = jest.fn().mockName('dispatch');
  useDispatch.mockReturnValue(dispatchMock);
  useSelector.mockReturnValue([message1, message2]);

  it('renders correctly', () => {
    const wrapper = render(<AdminMessagesContainer />);

    expect(wrapper.container).toMatchSnapshot();

    expect(AdminMessage).toHaveBeenCalledTimes(2);
    expect(AdminMessage).toHaveBeenCalledWith({ deleteMessage: expect.any(Function), message: message1 }, {});
    expect(AdminMessage).toHaveBeenCalledWith({ deleteMessage: expect.any(Function), message: message2 }, {});
    expect(useDispatch).toHaveBeenCalledTimes(1);
    expect(useSelector).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledTimes(1);
  });
});

describe('confirmDeleteMessage', () => {
  const dispatchMock = jest.fn();

  it('opens a modal dialog', async () => {
    await confirmDeleteMessage(dispatchMock)(message1);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({ payload: {
      modalType: 'MODAL_TYPE_CONFIRMATION',
      props: {
        title: 'Delete message',
        body: 'Would you like to delete this message?',
        onCancel: expect.any(Function),
        onSubmit: expect.any(Function),
      },
    },
    type: 'OPEN_MODAL_DIALOG' });
  });
});

describe('deleteMessage', () => {
  const dispatchMock = jest.fn();

  it('notifies success when successful', async () => {
    await deleteMessage(dispatchMock, message1);

    expect(dispatchMock).toHaveBeenCalledTimes(4);
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'DELETE_MESSAGE_ACTION' }));
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'CLOSE_MODAL_DIALOG' }));
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'GET_ALL_MESSAGES_ACTION' }));
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'GET_MESSAGES_ACTION' }));
    expect(notify.error).not.toHaveBeenCalled();
    expect(notify.success).toHaveBeenCalledWith('Message deleted.');
  });

  it('notifies error when there is an error', async () => {
    dispatchMock.mockRejectedValueOnce('expected test error');

    await deleteMessage(dispatchMock, message1);

    expect(dispatchMock).toHaveBeenCalledTimes(3);
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'DELETE_MESSAGE_ACTION' }));
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'GET_ALL_MESSAGES_ACTION' }));
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'GET_MESSAGES_ACTION' }));
    expect(notify.success).not.toHaveBeenCalled();
    expect(notify.error).toHaveBeenCalledWith('Unable to delete message.');
  });
});

