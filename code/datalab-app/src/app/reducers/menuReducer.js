import typeToReducer from 'type-to-reducer';
import { MENU_SHOW_ACTION, MENU_HIDE_ACTION } from '../actions/menuActions';

const initialState = {
  isMenuOpen: false,
};

export default typeToReducer({
  [MENU_SHOW_ACTION]: state => ({ ...initialState, isMenuOpen: true }),
  [MENU_HIDE_ACTION]: () => initialState,
}, initialState);
