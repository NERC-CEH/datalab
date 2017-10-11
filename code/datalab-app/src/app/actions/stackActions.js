import stackService from '../api/stackService';

export const LOAD_STACKS_ACTION = 'LOAD_STACKS';
export const LOAD_STACKS_BY_CATEGORY_ACTION = 'LOAD_STACKS_BY_CATEGORY';
export const GET_STACK_URL_ACTION = 'GET_STACK_URL';
export const OPEN_STACK_ACTION = 'OPEN_STACK';
export const CREATE_STACK_ACTION = 'CREATE_STACK';
export const CHECK_STACK_NAME_ACTION = 'CHECK_STACK_NAME';
export const DELETE_STACK_ACTION = 'DELETE_STACK';

const loadStacks = () => ({
  type: LOAD_STACKS_ACTION,
  payload: stackService.loadStacks(),
});

const loadStacksByCategory = category => ({
  type: LOAD_STACKS_BY_CATEGORY_ACTION,
  payload: stackService.loadStacksByCategory(category),
});

const getUrl = id => ({
  type: GET_STACK_URL_ACTION,
  payload: stackService.getUrl(id),
});

const openStack = notebookUrl => ({
  type: OPEN_STACK_ACTION,
  payload: window.open(notebookUrl),
});

const createStack = stack => ({
  type: CREATE_STACK_ACTION,
  payload: stackService.createStack(stack),
});

const checkStackName = notebookName => ({
  type: CHECK_STACK_NAME_ACTION,
  payload: stackService.checkStackName(notebookName),
});

const deleteStack = (notebook) => {
  const { name, type } = notebook;
  return {
    type: DELETE_STACK_ACTION,
    payload: stackService.deleteNotebook({ name, type }),
  };
};

export default {
  loadStacks,
  loadStacksByCategory,
  getUrl,
  openStack,
  createStack,
  checkStackName,
  deleteStack,
};
