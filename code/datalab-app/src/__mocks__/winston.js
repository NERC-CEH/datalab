const messages = [];

function clearMessages() {
  messages.length = 0;
}

function getMessages() {
  return messages;
}

function error(message, data, metadata) {
  messages.push({ message, data, metadata });
}

export default { error, clearMessages, getMessages };
