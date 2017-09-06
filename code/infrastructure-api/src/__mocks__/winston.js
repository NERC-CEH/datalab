const messages = {
  info: [],
  error: [],
  debug: [],
};

function clearMessages() {
  messages.info.length = 0;
  messages.error.length = 0;
  messages.debug.length = 0;
}

function getInfoMessages() {
  return messages.info;
}

function getErrorMessages() {
  return messages.error;
}

function getDebugMessages() {
  return messages.debug;
}

function info(message, data, metadata) {
  messages.info.push({ message, data, metadata });
}

function error(message, data, metadata) {
  messages.error.push({ message, data, metadata });
}

function debug(message, data, metadata) {
  messages.debug.push({ message, data, metadata });
}

export default { info, error, debug, clearMessages, getInfoMessages, getErrorMessages, getDebugMessages };
