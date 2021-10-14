import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import messagesActions from '../../actions/messagesActions';
import AdminMessage from './AdminMessage';
import modalDialogActions from '../../actions/modalDialogActions';
import { MODAL_TYPE_CONFIRMATION } from '../../constants/modaltypes';
import notify from '../../components/common/notify';
import MessageCreator from './MessageCreator';

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

export const createMessage = async (dispatch, messageText, expiryDate, clearData) => {
  try {
    const message = {
      message: messageText,
      expiry: expiryDate,
    };
    await dispatch(messagesActions.createMessage(message));
    dispatch(modalDialogActions.closeModalDialog());
    clearData();
    notify.success('Message created.');
  } catch (error) {
    notify.error('Unable to create message.');
  } finally {
    await dispatch(messagesActions.getAllMessages());
    await dispatch(messagesActions.getMessages());
  }
};

export const confirmCreateMessage = dispatch => (messageText, expiryDate, clearData) => dispatch(modalDialogActions.openModalDialog(MODAL_TYPE_CONFIRMATION, {
  title: 'Create message',
  body: ['Would you like to create this message?', `Text: ${messageText}`, `Expiry: ${expiryDate.toString()}`],
  onSubmit: () => createMessage(dispatch, messageText, expiryDate, clearData),
  onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
  confirmText: 'Create',
  confirmIcon: 'check',
  danger: false,
}));

const AdminMessagesContainer = () => {
  const dispatch = useDispatch();
  const messages = useSelector(s => s.adminMessages.value);

  useEffect(() => {
    dispatch(messagesActions.getAllMessages());
  }, [dispatch]);

  return (
    <div>
      <MessageCreator createMessage={confirmCreateMessage(dispatch)}/>
      <div>
        <Typography variant="h5">Existing Messages</Typography>
        {messages.map(m => <AdminMessage message={m} key={m.id} deleteMessage={confirmDeleteMessage(dispatch)}/>)}
      </div>
    </div>
  );
};

export default AdminMessagesContainer;
