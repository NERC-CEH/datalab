import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import { GET_ALL_USERS_AND_ROLES_ACTION, SET_INSTANCE_ADMIN_ACTION, SET_CATALOGUE_ROLE_ACTION } from '../actions/roleActions';

const initialState = {
  fetching: false,
  updating: false,
  value: [],
  error: null,
};

export function updateInstanceAdmin(value, { userId, instanceAdmin }) {
  const matchingUsers = value.filter(item => item.userId === userId);
  const updatedUser = matchingUsers.length > 0 ? { ...matchingUsers[0], instanceAdmin } : { userId, instanceAdmin };
  const users = [
    ...value.filter(item => item.userId !== userId), // other users
    updatedUser,
  ];
  return users;
}

export function updateCatalogueRole(value, { userId, catalogueRole }) {
  const matchingUsers = value.filter(item => item.userId === userId);
  const updatedUser = matchingUsers.length > 0 ? { ...matchingUsers[0], catalogueRole } : { userId, catalogueRole };
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
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: updateInstanceAdmin(state.value, action.payload) }),
  },
  [SET_CATALOGUE_ROLE_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, updating: true, value: state.value }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload, value: state.value }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: updateCatalogueRole(state.value, action.payload) }),
  },
}, initialState);
