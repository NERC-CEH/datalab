import messagesReducer from './messagesReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import {
  GET_MESSAGES_ACTION, DISMISS_MESSAGE_ACTION,
} from '../actions/messagesActions';
import { getMessagesToDisplay, getUpdatedMessages } from './messageStorage';

const baseState = () => ({
  fetching: false,
  value: [],
  error: null,
});

jest.mock('./messageStorage');

describe('messagesReducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getMessagesToDisplay.mockImplementation(m => m);
    getUpdatedMessages.mockReturnValue([]);
  });

  describe('GET_MESSAGES_ACTION', () => {
    it('handles pending action type correctly', () => {
      const currentState = baseState();
      const type = `${GET_MESSAGES_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      const nextState = messagesReducer(currentState, action);

      expect(nextState).toEqual({
        ...baseState(),
        fetching: true,
      });
      expect(getMessagesToDisplay).toHaveBeenCalledTimes(0);
    });

    it('handles successful action type correctly', () => {
      const messages = [{ id: 'id1' }];
      const currentState = baseState();
      const type = `${GET_MESSAGES_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = { messages };
      const action = { type, payload };

      const nextState = messagesReducer(currentState, action);

      expect(nextState).toEqual({
        ...baseState(),
        value: messages,
      });
      expect(getMessagesToDisplay).toHaveBeenCalledTimes(1);
      expect(getMessagesToDisplay).toHaveBeenCalledWith(messages);
    });

    it('handles failed action type correctly', () => {
      const messages = [{ id: 'id1' }];
      const currentState = {
        ...baseState(),
        value: messages,
      };
      const type = `${GET_MESSAGES_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'error';
      const action = { type, payload };

      const nextState = messagesReducer(currentState, action);

      expect(nextState).toEqual({
        ...baseState(),
        value: messages,
        error: 'error',
      });
      expect(getMessagesToDisplay).toHaveBeenCalledTimes(0);
    });
  });

  describe('DISMISS_MESSAGE_ACTION', () => {
    it('handles action correctly', () => {
      const messages = [{ id: 'id1' }];
      const currentState = {
        ...baseState(),
        value: messages,
      };
      const type = DISMISS_MESSAGE_ACTION;
      const payload = 'id1';
      const action = { type, payload };

      const nextState = messagesReducer(currentState, action);

      expect(nextState).toEqual({
        ...baseState(),
        value: [],
      });
      expect(getUpdatedMessages).toHaveBeenCalledTimes(1);
      expect(getUpdatedMessages).toHaveBeenCalledWith(messages, payload);
    });
  });
});
