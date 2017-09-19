export const OPEN_MODAL_DIALOG_ACTION = 'OPEN_MODAL_DIALOG';
export const CLOSE_MODAL_DIALOG_ACTION = 'CLOSE_MODAL_DIALOG';

const openModalDialog = () => ({
  type: OPEN_MODAL_DIALOG_ACTION,
});

const closeModalDialog = () => ({
  type: CLOSE_MODAL_DIALOG_ACTION,
});

export default {
  openModalDialog,
  closeModalDialog,
};
