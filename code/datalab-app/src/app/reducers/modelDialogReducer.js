import typeToReducer from 'type-to-reducer';
import {
  OPEN_MODAL_DIALOG_ACTION,
  CLOSE_MODAL_DIALOG_ACTION,
} from '../actions/modalDialogActions';

const initialState = {
  open: false,
};

export default typeToReducer({
  [OPEN_MODAL_DIALOG_ACTION]: (state, action) => ({ ...initialState, open: true }),
  [CLOSE_MODAL_DIALOG_ACTION]: (state, action) => ({ ...initialState, open: false }),
}, initialState);
