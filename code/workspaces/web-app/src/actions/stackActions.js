import stackService from '../api/stackService';

export const LOAD_STACKS_ACTION = 'LOAD_STACKS';
export const LOAD_STACKS_BY_CATEGORY_ACTION = 'LOAD_STACKS_BY_CATEGORY';
export const UPDATE_STACKS_ACTION = 'UPDATE_STACKS';
export const UPDATE_STACKS_BY_CATEGORY_ACTION = 'UPDATE_STACKS_BY_CATEGORY';
export const GET_STACK_URL_ACTION = 'GET_STACK_URL';
export const OPEN_STACK_ACTION = 'OPEN_STACK';
export const CREATE_STACK_ACTION = 'CREATE_STACK';
export const DELETE_STACK_ACTION = 'DELETE_STACK';
export const GET_LOGS_ACTION = 'GET_LOGS';

const loadStacks = () => ({
  type: LOAD_STACKS_ACTION,
  payload: stackService.loadStacks(),
});

const loadStacksByCategory = (projectKey, category) => ({
  type: LOAD_STACKS_BY_CATEGORY_ACTION,
  payload: stackService.loadStacksByCategory(projectKey, category),
});

const updateStacks = () => ({
  type: UPDATE_STACKS_ACTION,
  payload: stackService.loadStacks(),
});

const updateStacksByCategory = (projectKey, category) => ({
  type: UPDATE_STACKS_BY_CATEGORY_ACTION,
  payload: stackService.loadStacksByCategory(projectKey, category),
});

const getUrl = (projectKey, id) => ({
  type: GET_STACK_URL_ACTION,
  payload: stackService.getUrl(projectKey, id),
});

const openStack = stackUrl => ({
  type: OPEN_STACK_ACTION,
  payload: window.open(stackUrl),
});

const createStack = stack => ({
  type: CREATE_STACK_ACTION,
  payload: stackService.createStack(stack),
});

const deleteStack = ({ projectKey, name, type }) => ({
  type: DELETE_STACK_ACTION,
  payload: stackService.deleteStack({ projectKey, name, type }),
});

const getLogs = (projectKey, name) => ({
  type: GET_LOGS_ACTION,
  payload: stackService.getLogs(projectKey, name),
});

export default {
  loadStacks,
  loadStacksByCategory,
  updateStacks,
  updateStacksByCategory,
  getUrl,
  openStack,
  createStack,
  deleteStack,
  getLogs,
};
