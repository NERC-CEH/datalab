import messagesActions, {
  CREATE_MESSAGE_ACTION,
  DELETE_MESSAGE_ACTION,
  GET_MESSAGES_ACTION,
  GET_ALL_MESSAGES_ACTION,
  DISMISS_MESSAGE_ACTION,
} from './messagesActions';
import messagesService from '../api/messagesService';

jest.mock('../api/messagesService');

const { createMessage, deleteMessage, getMessages, getAllMessages } = messagesService;

const messageId = 'msgId';
const message1 = { id: 'id1' };
const message2 = { id: 'id2' };
const messages = [message1, message2];

describe('messagesActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createMessage.mockReturnValue(message1);
    deleteMessage.mockReturnValue(message1);
    getMessages.mockReturnValue(messages);
    getAllMessages.mockReturnValue(messages);
  });

  describe('createMessage', () => {
    it('makes correct api call', () => {
      const output = messagesActions.createMessage(message1);

      expect(createMessage).toHaveBeenCalledTimes(1);
      expect(output).toEqual({
        type: CREATE_MESSAGE_ACTION,
        payload: message1,
      });
    });
  });

  describe('deleteMessage', () => {
    it('makes correct api call', () => {
      const output = messagesActions.deleteMessage(message1);

      expect(deleteMessage).toHaveBeenCalledTimes(1);
      expect(output).toEqual({
        type: DELETE_MESSAGE_ACTION,
        payload: message1,
      });
    });
  });

  describe('getMessages', () => {
    it('makes correct api call', () => {
      const output = messagesActions.getMessages();

      expect(getMessages).toHaveBeenCalledTimes(1);
      expect(output).toEqual({
        type: GET_MESSAGES_ACTION,
        payload: messages,
      });
    });
  });

  describe('getAllMessages', () => {
    it('makes correct api call', () => {
      const output = messagesActions.getAllMessages();

      expect(getAllMessages).toHaveBeenCalledTimes(1);
      expect(output).toEqual({
        type: GET_ALL_MESSAGES_ACTION,
        payload: messages,
      });
    });
  });

  describe('dismissMessage', () => {
    it('creates correct action', () => {
      const output = messagesActions.dismissMessage(messageId);

      expect(output).toEqual({
        type: DISMISS_MESSAGE_ACTION,
        payload: messageId,
      });
    });
  });
});

