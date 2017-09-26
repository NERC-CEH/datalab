export const OPEN_MODAL_DIALOG_ACTION = 'OPEN_MODAL_DIALOG';
export const CLOSE_MODAL_DIALOG_ACTION = 'CLOSE_MODAL_DIALOG';

const openModalDialog = (modalType, props) => ({
  type: OPEN_MODAL_DIALOG_ACTION,
  payload: { modalType, props },
});

const closeModalDialog = () => ({
  type: CLOSE_MODAL_DIALOG_ACTION,
});

export default {
  openModalDialog,
  closeModalDialog,
};
