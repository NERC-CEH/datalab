import typeToReducer from 'type-to-reducer';

import {
  COUNTER_ACTION_BASE,
  INC_ACTION,
  SET_ACTION,
  CLEAR_ACTION,
} from '../actions/counterActions';

const initialState = {
  value: 0,
};

export default typeToReducer({
  [COUNTER_ACTION_BASE]: {
    [INC_ACTION]: state => ({ ...initialState, value: state.value + 1 }),
    [SET_ACTION]: (state, action) => ({ ...initialState, value: action.payload }),
    [CLEAR_ACTION]: () => ({ ...initialState }),
  },
}, { ...initialState });
