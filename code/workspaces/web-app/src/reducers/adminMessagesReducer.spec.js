import adminMessagesReducer from './adminMessagesReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import {
  GET_ALL_MESSAGES_ACTION,
} from '../actions/messagesActions';

const baseState = () => ({
  fetching: false,
  value: [],
  error: null,
});

describe('adminMessagesReducer', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET_ALL_MESSAGES_ACTION', () => {
    it('handles pending action type correctly', () => {
      const currentState = baseState();
      const type = `${GET_ALL_MESSAGES_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      const nextState = adminMessagesReducer(currentState, action);

      expect(nextState).toEqual({
        ...baseState(),
        fetching: true,
      });
    });

    it('handles successful action type correctly', () => {
      const allMessages = [{ id: 'id1' }];
      const currentState = baseState();
      const type = `${GET_ALL_MESSAGES_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = { allMessages };
      const action = { type, payload };

      const nextState = adminMessagesReducer(currentState, action);

      expect(nextState).toEqual({
        ...baseState(),
        value: allMessages,
      });
    });

    it('handles failed action type correctly', () => {
      const allMessages = [{ id: 'id1' }];
      const currentState = {
        ...baseState(),
        value: allMessages,
      };
      const type = `${GET_ALL_MESSAGES_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'error';
      const action = { type, payload };

      const nextState = adminMessagesReducer(currentState, action);

      expect(nextState).toEqual({
        ...baseState(),
        value: allMessages,
        error: 'error',
      });
    });
  });
});
