import { combineReducers } from 'redux';
import menu from './menuReducer';

const rootReducer = combineReducers({
  menu,
});

export default rootReducer;
