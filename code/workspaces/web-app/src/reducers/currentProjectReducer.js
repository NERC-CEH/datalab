import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import {
  SET_CURRENT_PROJECT_ACTION,
  CLEAR_CURRENT_PROJECT_ACTION,
} from '../actions/projectActions';

const initialState = {
  fetching: false,
  value: {},
  error: null,
};

export default typeToReducer({
  [SET_CURRENT_PROJECT_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, fetching: true, value: { ...state.value } }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload, value: { ...state.value } }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: action.payload }),
  },
  [CLEAR_CURRENT_PROJECT_ACTION]: () => ({ ...initialState }),
}, initialState);
