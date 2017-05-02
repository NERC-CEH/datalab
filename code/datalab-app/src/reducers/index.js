import { combineReducers } from 'redux';
import menu from './menuReducer';
import counter from './counterReducer';
import ping from './pingReducer';

const rootReducer = combineReducers({
  menu,
  counter,
  ping,
});

export default rootReducer;
