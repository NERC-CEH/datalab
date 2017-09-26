import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import authentication from './authReducer';
import dataStorage from './dataStorageReducer';
import dataStore from './dataStoreReducer';
import notebooks from './notebooksReducer';
import modal from './modelDialogReducer';

const rootReducer = combineReducers({
  authentication,
  dataStorage,
  dataStore,
  notebooks,
  modal,
  router: routerReducer,
  form: formReducer,
});

export default rootReducer;
