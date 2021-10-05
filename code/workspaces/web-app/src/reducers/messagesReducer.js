import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import { GET_MESSAGES_ACTION, DISMISS_MESSAGE_ACTION } from '../actions/messagesActions';
import { getMessagesToDisplay, getUpdatedMessages } from './messageStorage';

const initialState = {
  fetching: false,
  value: [],
  error: null,
};

export default typeToReducer({
  [GET_MESSAGES_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, fetching: true, value: state.value }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: getMessagesToDisplay(action.payload.messages) }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, value: state.value, error: action.payload }),
  },
  [DISMISS_MESSAGE_ACTION]: (state, action) => ({ ...initialState, value: getUpdatedMessages(state.value, action.payload) }),
}, initialState);
