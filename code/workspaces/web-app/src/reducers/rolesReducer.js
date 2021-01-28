import typeToReducer from 'type-to-reducer';
import { permissionTypes } from 'common';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import { GET_ALL_USERS_AND_ROLES_ACTION, SET_INSTANCE_ADMIN_ACTION, SET_DATA_MANAGER_ACTION, SET_CATALOGUE_ROLE_ACTION } from '../actions/roleActions';

const { INSTANCE_ADMIN_ROLE_KEY, DATA_MANAGER_ROLE_KEY, CATALOGUE_ROLE_KEY } = permissionTypes;

const initialState = {
  fetching: false,
  updating: false,
  value: [],
  error: null,
};

export function setSystemRole(value, roleKey, payload) {
  const { userId } = payload;
  const roleValue = payload[roleKey];
  const matchingUsers = value.filter(item => item.userId === userId);
  const updatedUser = matchingUsers.length > 0 ? { ...matchingUsers[0], [roleKey]: roleValue } : { userId, [roleKey]: roleValue };
  const users = [
    ...value.filter(item => item.userId !== userId), // other users
    updatedUser,
  ];
  return users;
}

export default typeToReducer({
  [GET_ALL_USERS_AND_ROLES_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, fetching: true, value: state.value }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload, value: state.value }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: action.payload }),
  },
  [SET_INSTANCE_ADMIN_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, updating: true, value: state.value }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload, value: state.value }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: setSystemRole(state.value, INSTANCE_ADMIN_ROLE_KEY, action.payload) }),
  },
  [SET_DATA_MANAGER_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, updating: true, value: state.value }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload, value: state.value }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: setSystemRole(state.value, DATA_MANAGER_ROLE_KEY, action.payload) }),
  },
  [SET_CATALOGUE_ROLE_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, updating: true, value: state.value }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload, value: state.value }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: setSystemRole(state.value, CATALOGUE_ROLE_KEY, action.payload) }),
  },
}, initialState);
