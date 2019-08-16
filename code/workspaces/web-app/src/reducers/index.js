import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';
import authentication from './authReducer';
import dataStorage from './dataStorageReducer';
import stacks from './stacksReducer';
import modal from './modelDialogReducer';
import users from './usersReducer';

const rootReducer = history => combineReducers({
  authentication,
  dataStorage,
  stacks,
  modal,
  users,
  router: connectRouter(history),
  form: formReducer,
});

export default rootReducer;