import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authentication from './authReducer';

const rootReducer = combineReducers({
  authentication,
  router: routerReducer,
});

export default rootReducer;
