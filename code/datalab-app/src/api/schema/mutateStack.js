import { StackCreationType, StackDeletionType, StackType } from '../types/stackTypes';
import config from '../config';
import stackApi from '../infrastructure/stackApi';

const DATALAB_NAME = config.get('datalabName');

export const createStack = {
  type: StackType,
  description: 'Create a new stack',
  args: {
    stack: { type: StackCreationType },
  },
  resolve: (obj, { stack }, { user }) => stackApi.createStack(user, DATALAB_NAME, stack),
};

export const deleteStack = {
  type: StackType,
  description: 'Delete a stack',
  args: {
    stack: { type: StackDeletionType },
  },
  resolve: (obj, { stack }, { user }) => stackApi.deleteStack(user, DATALAB_NAME, stack),
};
