import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
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
});

export default rootReducer;
