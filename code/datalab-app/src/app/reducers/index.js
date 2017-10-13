import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import authentication from './authReducer';
import dataStorage from './dataStorageReducer';
import dataStore from './dataStoreReducer';
import stacks from './stacksReducer';
import modal from './modelDialogReducer';

const rootReducer = combineReducers({
  authentication,
  dataStorage,
  dataStore,
  stacks,
  modal,
  router: routerReducer,
  form: formReducer,
});

export default rootReducer;
