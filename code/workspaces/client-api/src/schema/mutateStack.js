import { permissionTypes } from 'common';
import { StackCreationType, StackDeletionType, StackType } from '../types/stackTypes';
import config from '../config';
import permissionChecker from '../auth/permissionChecker';
import stackApi from '../infrastructure/stackApi';

const { elementPermissions: { STACKS_CREATE, STACKS_DELETE } } = permissionTypes;

const DATALAB_NAME = config.get('datalabName');

export const createStack = {
  type: StackType,
  description: 'Create a new stack',
  args: {
    stack: { type: StackCreationType },
  },
  resolve: (obj, { stack }, { user, token }) => permissionChecker(STACKS_CREATE, user, () => stackApi.createStack({ user, token }, DATALAB_NAME, stack)),
};

export const deleteStack = {
  type: StackType,
  description: 'Delete a stack',
  args: {
    stack: { type: StackDeletionType },
  },
  resolve: (obj, { stack }, { user, token }) => permissionChecker(STACKS_DELETE, user, () => stackApi.deleteStack({ user, token }, DATALAB_NAME, stack)),
};
