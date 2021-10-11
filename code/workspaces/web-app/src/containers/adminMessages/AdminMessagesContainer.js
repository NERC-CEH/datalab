import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messagesActions from '../../actions/messagesActions';
import AdminMessage from './AdminMessage';
import modalDialogActions from '../../actions/modalDialogActions';
import { MODAL_TYPE_CONFIRMATION } from '../../constants/modaltypes';
import notify from '../../components/common/notify';

export const deleteMessage = async (dispatch, message) => {
  try {
    await dispatch(messagesActions.deleteMessage(message.id));
    dispatch(modalDialogActions.closeModalDialog());
    notify.success('Message deleted.');
  } catch (error) {
    notify.error('Unable to delete message.');
  } finally {
    await dispatch(messagesActions.getAllMessages());
    await dispatch(messagesActions.getMessages());
  }
};

export const confirmDeleteMessage = dispatch => message => dispatch(modalDialogActions.openModalDialog(MODAL_TYPE_CONFIRMATION, {
  title: 'Delete message',
  body: 'Would you like to delete this message?',
  onSubmit: () => deleteMessage(dispatch, message),
  onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
}));

const AdminMessagesContainer = () => {
  const dispatch = useDispatch();
  const messages = useSelector(s => s.adminMessages.value);

  useEffect(() => {
    dispatch(messagesActions.getAllMessages());
  }, [dispatch]);

  return (
    <div>
      {messages.map(m => <AdminMessage message={m} key={m.id} deleteMessage={confirmDeleteMessage(dispatch)}/>)}
    </div>
  );
};

export default AdminMessagesContainer;
