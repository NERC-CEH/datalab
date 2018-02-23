import { StackCreationType, StackDeletionType, StackType } from '../types/stackTypes';
import config from '../config';
import stackApi from '../infrastructure/stackApi';
import permissionChecker from '../auth/permissionChecker';

const DATALAB_NAME = config.get('datalabName');

export const createStack = {
  type: StackType,
  description: 'Create a new stack',
  args: {
    stack: { type: StackCreationType },
  },
  resolve: (obj, { stack }, { user, token }) =>
    permissionChecker('stacks:create', user, () => stackApi.createStack({ user, token }, DATALAB_NAME, stack)),
};

export const deleteStack = {
  type: StackType,
  description: 'Delete a stack',
  args: {
    stack: { type: StackDeletionType },
  },
  resolve: (obj, { stack }, { user, token }) =>
    permissionChecker('stacks:delete', user, () => stackApi.deleteStack({ user, token }, DATALAB_NAME, stack)),
};
