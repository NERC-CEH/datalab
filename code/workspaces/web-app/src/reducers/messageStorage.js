const messageField = 'dismissedMessages';

export const setDismissedMessage = (id) => {
  // If a message has been dismissed, store its ID in local storage.
  const alreadyDismissed = getDismissedMessages();

  if (!alreadyDismissed.includes(id)) {
    const updatedDismissed = [
      ...alreadyDismissed,
      id,
    ];
    localStorage.setItem(messageField, JSON.stringify(updatedDismissed));
  }
};

export const getDismissedMessages = () => {
  const messages = localStorage.getItem(messageField);
  if (!messages) {
    return [];
  }

  return JSON.parse(messages);
};

export const filterExpiredMessages = (messages) => {
  // The messages returned from the backend are all "active" (i.e. not expired).
  // So, if there are messages in the cache that aren't in this response, we can clear them from the cache as they have expired.
  const dismissed = getDismissedMessages();
  const activeMessageIds = messages.map(m => m.id);

  const activeDismissed = dismissed.filter(d => activeMessageIds.includes(d));
  localStorage.setItem(messageField, JSON.stringify(activeDismissed));

  return activeDismissed;
};

export const getMessagesToDisplay = (messages) => {
  if (!messages) {
    return [];
  }

  // Only display messages that have not been dismissed.
  const dismissed = filterExpiredMessages(messages);

  return messages.filter(m => !dismissed.includes(m.id));
};

export const getUpdatedMessages = (messages, messageId) => {
  // When a message is dismissed, remove it from the list of messages.
  setDismissedMessage(messageId);

  return messages.filter(m => m.id !== messageId);
};
