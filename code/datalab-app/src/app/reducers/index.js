import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import authentication from './authReducer';
import dataStorage from './dataStorageReducer';
import dataStore from './dataStoreReducer';
import notebooks from './notebooksReducer';

const rootReducer = combineReducers({
  authentication,
  dataStorage,
  dataStore,
  notebooks,
  router: routerReducer,
  form: formReducer,
});

export default rootReducer;
