import typeToReducer from 'type-to-reducer';
import {
  OPEN_MODAL_DIALOG_ACTION,
  CLOSE_MODAL_DIALOG_ACTION,
} from '../actions/modalDialogActions';

const initialState = {
  type: null,
  props: {},
};

export default typeToReducer({
  [OPEN_MODAL_DIALOG_ACTION]: (state, action) => ({ ...initialState, type: action.payload.type, props: action.payload.props }),
  [CLOSE_MODAL_DIALOG_ACTION]: (state, action) => ({ ...initialState }),
}, initialState);
