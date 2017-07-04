import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import menu from './menuReducer';
import counter from './counterReducer';
import ping from './pingReducer';
import graphQL from './graphQLReducer';
import authentication from './authReducer';

const rootReducer = combineReducers({
  menu,
  counter,
  ping,
  graphQL,
  authentication,
  router: routerReducer,
});

export default rootReducer;
