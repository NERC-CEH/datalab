import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import authentication from './authReducer';
import dataStorage from './dataStorageReducer';
import stacks from './stacksReducer';
import modal from './modelDialogReducer';
import users from './usersReducer';

const rootReducer = combineReducers({
  authentication,
  dataStorage,
  stacks,
  modal,
  users,
  router: routerReducer,
  form: formReducer,
});

export default rootReducer;
