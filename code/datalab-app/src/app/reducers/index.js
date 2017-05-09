import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import menu from './menuReducer';
import counter from './counterReducer';
import ping from './pingReducer';

const rootReducer = combineReducers({
  menu,
  counter,
  ping,
  router: routerReducer,
});

export default rootReducer;
