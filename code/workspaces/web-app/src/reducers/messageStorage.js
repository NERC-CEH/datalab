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

export const getMessagesToDisplay = (messages) => {
  // Only display messages that have not been dismissed.
  const dismissed = getDismissedMessages();
  if (!messages) {
    return [];
  }

  return messages.filter(m => !dismissed.includes(m.id));
};

export const getUpdatedMessages = (messages, messageId) => {
  // When a message is dismissed, remove it from the list of messages.
  setDismissedMessage(messageId);

  return messages.filter(m => m.id !== messageId);
};
