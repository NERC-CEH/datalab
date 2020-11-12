import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import {
  GET_OTHER_USER_ROLES_ACTION,
} from '../actions/otherUserRolesActions';

const initialState = {
  fetching: false,
  value: {},
  error: null,
};

export default typeToReducer({
  [GET_OTHER_USER_ROLES_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, fetching: true, value: state.value }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload, value: state.value }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({
      ...initialState,
      value: {
        ...state.value,
        [action.payload.userId]: action.payload.otherUserRoles,
      },
    }),
  },
}, initialState);
