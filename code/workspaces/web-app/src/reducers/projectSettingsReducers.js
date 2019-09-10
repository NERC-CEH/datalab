import typeToReducer from 'type-to-reducer';
import {
  GET_PROJECT_USER_PERMISSIONS_ACTION,
  ADD_PROJECT_USER_PERMISSION_ACTION,
} from '../actions/projectSettingsActions';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';

const initialState = {
  fetching: {
    inProgress: false,
    error: false,
  },
  updating: {
    inProgress: false,
    error: false,
  },
  value: [],
};

export default typeToReducer({
  [GET_PROJECT_USER_PERMISSIONS_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({
      ...state,
      fetching: { ...initialState.fetching, inProgress: true },
      updating: { ...initialState.updating },
    }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({
      ...initialState,
      value: action.payload,
    }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({
      ...initialState,
      fetching: { ...initialState.fetching, error: true },
      value: action.payload,
    }),
  },
  [ADD_PROJECT_USER_PERMISSION_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({
      ...state,
      fetching: { ...initialState.fetching },
      updating: { ...initialState.updating, inProgress: true },
    }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({
      ...initialState,
      value: mergeUserIntoUsers(
        state.value,
        { ...action.payload.user, role: action.payload.role },
      ),
    }),
    [PROMISE_TYPE_FAILURE]: state => ({
      ...state,
      updating: { ...initialState.updating, error: true },
    }),
  },
}, initialState);

function mergeUserIntoUsers(users, user) {
  const index = users.findIndex(item => item.userId === user.userId);
  const newUsers = [...users];

  if (index === -1) newUsers.push(user);
  else newUsers[index] = user;

  return newUsers;
}
