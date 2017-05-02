export const COUNTER_ACTION_BASE = 'COUNTER';
export const INC_ACTION = 'INC';
export const SET_ACTION = 'SET';
export const CLEAR_ACTION = 'CLEAR';

export default {
  incrementCounter: () => ({
    type: `${COUNTER_ACTION_BASE}_${INC_ACTION}`,
  }),
  setCounter: value => ({
    type: `${COUNTER_ACTION_BASE}_${SET_ACTION}`,
    payload: value,
  }),
  clearCounter: () => ({
    type: `${COUNTER_ACTION_BASE}_${CLEAR_ACTION}`,
  }),
};
