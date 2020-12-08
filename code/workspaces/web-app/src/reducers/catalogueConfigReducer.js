import typeToReducer from 'type-to-reducer';
import { LOAD_CATALOGUE_CONFIG_ACTION } from '../actions/catalogueConfigActions';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS } from '../actions/actionTypes';

const initialState = {
  value: {},
  fetching: false,
};

export default typeToReducer({
  [LOAD_CATALOGUE_CONFIG_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({
      ...state,
      fetching: true,
    }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({
      value: action.payload,
      fetching: false,
    }),
  },
}, initialState);
