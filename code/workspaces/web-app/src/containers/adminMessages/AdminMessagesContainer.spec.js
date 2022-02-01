import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { render } from '../../testUtils/renderTests';
import AdminMessagesContainer, { confirmCreateMessage, confirmDeleteMessage, createMessage, deleteMessage } from './AdminMessagesContainer';
import notify from '../../components/common/notify';

jest.mock('./AdminMessage', () => props => <>{`AdminMessage: ${JSON.stringify(props.message)}`}</>);
jest.mock('./MessageCreator', () => () => <>MessageCreator</>);

jest.mock('react-redux');
jest.mock('../../components/common/notify', () => ({ success: jest.fn(), error: jest.fn() }));
jest.mock('../../api/messagesService');

const msgText = 'some message';
const expiry = new Date('2021/01/01');
const clearData = jest.fn();

const message1 = { message: 'some message', id: '1234' };
const message2 = { message: 'other message', id: '5678' };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AdminMessagesContainer', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn().mockName('dispatch');
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockReturnValue([message1, message2]);
  });

  it('renders correctly', () => {
    const wrapper = render(<AdminMessagesContainer />);

    expect(wrapper.container).toMatchSnapshot();

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

describe('confirmCreateMessage', () => {
  const dispatchMock = jest.fn();

  it('opens a modal dialog', async () => {
    const expiryString = 'Fri Jan 01 2021 00:00:00';
    expiry.toString = jest.fn(() => expiryString);
    const expectedBody = [
      'Would you like to create this message?',
      'Text: some message',
      `Expiry: ${expiryString}`,
    ];

    await confirmCreateMessage(dispatchMock)(msgText, expiry, clearData);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({ payload: {
      modalType: 'MODAL_TYPE_CONFIRMATION',
      props: {
        title: 'Create message',
        body: expectedBody,
        onCancel: expect.any(Function),
        onSubmit: expect.any(Function),
        confirmText: 'Create',
        confirmIcon: 'check',
        danger: false,
      },
    },
    type: 'OPEN_MODAL_DIALOG' });
  });
});

describe('createMessage', () => {
  const dispatchMock = jest.fn();

  it('notifies success when successful', async () => {
    await createMessage(dispatchMock, msgText, expiry, clearData);

    expect(dispatchMock).toHaveBeenCalledTimes(4);
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'CREATE_MESSAGE_ACTION' }));
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'CLOSE_MODAL_DIALOG' }));
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'GET_ALL_MESSAGES_ACTION' }));
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'GET_MESSAGES_ACTION' }));
    expect(clearData).toHaveBeenCalledTimes(1);
    expect(notify.error).not.toHaveBeenCalled();
    expect(notify.success).toHaveBeenCalledWith('Message created.');
  });

  it('notifies error when there is an error', async () => {
    dispatchMock.mockRejectedValueOnce('expected test error');

    await createMessage(dispatchMock, msgText, expiry, clearData);

    expect(dispatchMock).toHaveBeenCalledTimes(3);
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'CREATE_MESSAGE_ACTION' }));
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'GET_ALL_MESSAGES_ACTION' }));
    expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'GET_MESSAGES_ACTION' }));
    expect(clearData).toHaveBeenCalledTimes(0);
    expect(notify.success).not.toHaveBeenCalled();
    expect(notify.error).toHaveBeenCalledWith('Unable to create message.');
  });
});

