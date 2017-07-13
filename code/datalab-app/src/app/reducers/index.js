import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authentication from './authReducer';
import dataStorage from './dataStorageReducer';
import dataStore from './dataStoreReducer';

const rootReducer = combineReducers({
  authentication,
  dataStorage,
  dataStore,
  router: routerReducer,
});

export default rootReducer;
