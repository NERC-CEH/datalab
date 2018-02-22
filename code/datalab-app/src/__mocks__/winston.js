const messages = {
  info: [],
  error: [],
  debug: [],
  warn: [],
};

function clearMessages() {
  messages.info.length = 0;
  messages.error.length = 0;
  messages.debug.length = 0;
  messages.warn.length = 0;
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

function getWarnMessage() {
  return messages.warn;
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

function warn(message, data, metadata) {
  messages.warn.push({ message, data, metadata });
}

export default { info, error, debug, warn, clearMessages, getInfoMessages, getErrorMessages, getDebugMessages };
