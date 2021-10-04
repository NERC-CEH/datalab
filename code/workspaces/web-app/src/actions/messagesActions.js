import messagesService from '../api/messagesService';

export const CREATE_MESSAGE_ACTION = 'CREATE_MESSAGE_ACTION';
export const DELETE_MESSAGE_ACTION = 'DELETE_MESSAGE_ACTION';
export const GET_MESSAGES_ACTION = 'GET_MESSAGES_ACTION';
export const GET_ALL_MESSAGES_ACTION = 'GET_ALL_MESSAGES_ACTION';
export const DISMISS_MESSAGE_ACTION = 'DISMISS_MESSAGE_ACTION';

const createMessage = message => ({
  type: CREATE_MESSAGE_ACTION,
  payload: messagesService.createMessage(message),
});

const deleteMessage = messageId => ({
  type: DELETE_MESSAGE_ACTION,
  payload: messagesService.deleteMessage(messageId),
});

const getMessages = () => ({
  type: GET_MESSAGES_ACTION,
  payload: messagesService.getMessages(),
});

const getAllMessages = () => ({
  type: GET_ALL_MESSAGES_ACTION,
  payload: messagesService.getAllMessages(),
});

const dismissMessage = messageId => ({
  type: DISMISS_MESSAGE_ACTION,
  payload: messageId,
});

export default { createMessage, deleteMessage, getMessages, getAllMessages, dismissMessage };
