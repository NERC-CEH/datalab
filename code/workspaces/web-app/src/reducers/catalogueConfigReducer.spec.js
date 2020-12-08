import catalogueConfigReducer from './catalogueConfigReducer';
import { LOAD_CATALOGUE_CONFIG_ACTION } from '../actions/catalogueConfigActions';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS } from '../actions/actionTypes';

describe('catalogueConfigReducer', () => {
  describe('LOAD_CATALOGUE_CONFIG_ACTION', () => {
    it('should handle PENDING state', () => {
      const startState = { fetching: false, value: { available: true } };
      const action = {
        type: `${LOAD_CATALOGUE_CONFIG_ACTION}_${PROMISE_TYPE_PENDING}`,
      };
      const nextState = catalogueConfigReducer(startState, action);
      expect(nextState).toEqual({ fetching: true, value: { available: true } });
    });

    it('should handle SUCCESS state', () => {
      const startState = { fetching: true, value: {} };
      const action = {
        type: `${LOAD_CATALOGUE_CONFIG_ACTION}_${PROMISE_TYPE_SUCCESS}`,
        payload: { available: true },
      };
      const nextState = catalogueConfigReducer(startState, action);
      expect(nextState).toEqual({ fetching: false, value: { available: true } });
    });
  });
});
