const messages = {
  debug: [],
  info: [],
  warn: [],
  error: [],
};

function clearMessages() {
  messages.debug.length = 0;
  messages.info.length = 0;
  messages.debug.length = 0;
  messages.error.length = 0;
}

function getDebugMessages() {
  return messages.debug;
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

function debug(message, data, metadata) {
  messages.debug.push({ message, data, metadata });
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

export default { debug, info, warn, error, clearMessages, getDebugMessages, getInfoMessages, getWarnMessages, getErrorMessages };
