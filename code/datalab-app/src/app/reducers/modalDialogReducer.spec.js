import modalDialogReducer from './modelDialogReducer';
import { OPEN_MODAL_DIALOG_ACTION, CLOSE_MODAL_DIALOG_ACTION } from '../actions/modalDialogActions';
import { MODAL_TYPE_CREATE_NOTEBOOK } from '../constants/modaltypes';

describe('modalDialogReducer', () => {
  it('should return the initial state', () => {
    // Act/Assert
    expect(modalDialogReducer(undefined, {})).toEqual({ type: null, props: {} });
  });

  it('should handle OPEN_MODAL_DIALOG_ACTION', () => {
    // Arrange
    const type = OPEN_MODAL_DIALOG_ACTION;
    const payload = { type: MODAL_TYPE_CREATE_NOTEBOOK, props: { value: 'test' } };
    const action = { type, payload };

    // Act
    const nextstate = modalDialogReducer({ type: null }, action);

    // Assert
    expect(nextstate).toEqual(payload);
  });

  it('should handle CLOSE_MODAL_DIALOG_ACTION', () => {
    // Arrange
    const type = CLOSE_MODAL_DIALOG_ACTION;
    const action = { type };

    // Act
    const nextstate = modalDialogReducer({ type: MODAL_TYPE_CREATE_NOTEBOOK, props: { value: 'test' } }, action);

    // Assert
    expect(nextstate).toEqual({ type: null, props: {} });
  });
});
