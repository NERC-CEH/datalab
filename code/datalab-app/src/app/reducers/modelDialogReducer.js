import typeToReducer from 'type-to-reducer';
import {
  OPEN_MODAL_DIALOG_ACTION,
  CLOSE_MODAL_DIALOG_ACTION,
} from '../actions/modalDialogActions';

const initialState = {
  modalType: null,
  props: {},
};

export default typeToReducer({
  [OPEN_MODAL_DIALOG_ACTION]: (state, action) => ({ ...initialState, modalType: action.payload.modalType, props: action.payload.props }),
  [CLOSE_MODAL_DIALOG_ACTION]: (state, action) => ({ ...initialState }),
}, initialState);
