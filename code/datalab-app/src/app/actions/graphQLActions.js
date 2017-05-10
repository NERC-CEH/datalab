import graphQLService from '../services/graphQLService';

export const GET_COUNT_ACTION = 'GET_COUNT';
export const INCREMENT_COUNT_ACTION = 'INCREMENT_COUNT_ACTION';
export const RESET_COUNT_ACTION = 'RESET_COUNT_ACTION';

const getCount = () => ({
  type: GET_COUNT_ACTION,
  payload: graphQLService.getCount(),
});
const incrementCount = () => ({
  type: INCREMENT_COUNT_ACTION,
  payload: graphQLService.incrementCount(),
});
const resetCount = () => ({
  type: RESET_COUNT_ACTION,
  payload: graphQLService.resetCount(),
});

export default {
  getCount,
  incrementCount,
  resetCount,
};
