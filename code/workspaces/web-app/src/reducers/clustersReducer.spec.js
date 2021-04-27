import clustersReducer from './clustersReducer';
import { PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE, PROMISE_TYPE_PENDING } from '../actions/actionTypes';
import { LOAD_CLUSTERS_ACTION } from '../actions/clusterActions';
import { GET_ALL_PROJECTS_AND_RESOURCES_ACTION } from '../actions/projectActions';

const clustersArray = [
  { name: 'cluster1' }, { name: 'cluster2' },
];

const getSuccessActionType = action => `${action}_${PROMISE_TYPE_SUCCESS}`;
const getPendingActionType = action => `${action}_${PROMISE_TYPE_PENDING}`;
const getFailureActionType = action => `${action}_${PROMISE_TYPE_FAILURE}`;

describe('LOAD_CLUSTERS_ACTION reducer', () => {
  it('handles pending action type correctly', () => {
    const currentState = { fetching: false, value: clustersArray, error: null };
    const action = { type: getPendingActionType(LOAD_CLUSTERS_ACTION) };

    const nextState = clustersReducer(currentState, action);

    expect(nextState).toEqual({
      fetching: true,
      value: clustersArray,
      error: null,
    });
  });

  it('handles successful action type correctly', () => {
    const currentState = { fetching: true, value: [], error: null };
    const action = { type: getSuccessActionType(LOAD_CLUSTERS_ACTION), payload: { clusters: clustersArray, projectKey: 'project-key' } };

    const nextState = clustersReducer(currentState, action);

    expect(nextState).toEqual({
      fetching: false,
      value: clustersArray,
      error: null,
    });
  });

  it('handle failed action type correctly', () => {
    const currentState = { fetching: true, value: clustersArray, error: null };
    const action = { type: getFailureActionType(LOAD_CLUSTERS_ACTION), payload: { message: 'expected error' } };

    const nextState = clustersReducer(currentState, action);

    expect(nextState).toEqual({
      fetching: false,
      value: currentState.value,
      error: { message: 'expected error' },
    });
  });
});

describe('GET_ALL_PROJECTS_AND_RESOURCES_ACTION reducer', () => {
  it('handles pending action type correctly', () => {
    const currentState = { fetching: false, value: clustersArray, error: null };
    const action = { type: getPendingActionType(GET_ALL_PROJECTS_AND_RESOURCES_ACTION) };

    const nextState = clustersReducer(currentState, action);

    expect(nextState).toEqual({
      fetching: true,
      value: clustersArray,
      error: null,
    });
  });

  it('handles successful action type correctly', () => {
    const currentState = { fetching: true, value: [], error: null };
    const action = { type: getSuccessActionType(GET_ALL_PROJECTS_AND_RESOURCES_ACTION), payload: { clusters: clustersArray } };

    const nextState = clustersReducer(currentState, action);

    expect(nextState).toEqual({
      fetching: false,
      value: clustersArray,
      error: null,
    });
  });

  it('handle failed action type correctly', () => {
    const currentState = { fetching: true, value: clustersArray, error: null };
    const action = { type: getFailureActionType(GET_ALL_PROJECTS_AND_RESOURCES_ACTION), payload: { message: 'expected error' } };

    const nextState = clustersReducer(currentState, action);

    expect(nextState).toEqual({
      fetching: false,
      value: currentState.value,
      error: { message: 'expected error' },
    });
  });
});
