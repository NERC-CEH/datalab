const messages = {
  info: [],
  warn: [],
  error: [],
  debug: [],
};

function clearMessages() {
  messages.info.length = 0;
  messages.warn.length = 0;
  messages.error.length = 0;
  messages.debug.length = 0;
}

function getInfoMessages() {
  return messages.info;
}

function getWarnMessages() {
  return messages.warn;
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

function warn(message, data, metadata) {
  messages.warn.push({ message, data, metadata });
}

function error(message, data, metadata) {
  messages.error.push({ message, data, metadata });
}

function debug(message, data, metadata) {
  messages.debug.push({ message, data, metadata });
}

export default {
  info, warn, error, debug, clearMessages, getInfoMessages, getWarnMessages, getErrorMessages, getDebugMessages,
};
