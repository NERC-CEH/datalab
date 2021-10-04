import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messagesActions from '../../actions/messagesActions';
import Message from './Message';

const MessageBanner = () => {
  const dispatch = useDispatch();
  const messages = useSelector(s => s.messages.value);

  useEffect(() => {
    dispatch(messagesActions.getMessages());
  }, [dispatch]);

  return (
  <div >
    {messages.map(m => <Message message={m} key={m.id}/>)}
  </div>
  );
};

export default MessageBanner;
