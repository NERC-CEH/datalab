import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import authentication from './authReducer';
import dataStorage from './dataStorageReducer';
import stacks from './stacksReducer';
import modal from './modelDialogReducer';

const rootReducer = combineReducers({
  authentication,
  dataStorage,
  stacks,
  modal,
  router: routerReducer,
  form: formReducer,
});

export default rootReducer;
