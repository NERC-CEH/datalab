export const PING_ACTION = 'PING_ACTION';

function pingSelf() {
  const before = Date.now();
  return fetch('/', { method: 'get' }).then(() => Date.now() - before);
}

export default {
  performPing: () => ({
    type: PING_ACTION,
    payload: pingSelf(),
  }),
};
