import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messagesActions from '../../actions/messagesActions';
import AdminMessage from './AdminMessage';

const AdminMessagesContainer = () => {
  const dispatch = useDispatch();
  const messages = useSelector(s => s.adminMessages.value);

  useEffect(() => {
    dispatch(messagesActions.getAllMessages());
  }, [dispatch]);

  return (
    <div>
      {messages.map(m => <AdminMessage message={m} key={m.id}/>)}
    </div>
  );
};

export default AdminMessagesContainer;
