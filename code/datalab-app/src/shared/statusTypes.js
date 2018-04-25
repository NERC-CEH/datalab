import { keyBy } from 'lodash';

export const REQUESTED = 'requested';
export const CREATING = 'creating';
export const READY = 'ready';
export const UNAVAILABLE = 'unavailable';

const STATUS_TYPES = [
  {
    name: REQUESTED,
    description: 'Resource has been requested',
  },
  {
    name: CREATING,
    description: 'Resource is being created',
  },
  {
    name: READY,
    description: 'Resource is ready for use',
  },
  {
    name: UNAVAILABLE,
    description: 'Resource is currently unavailable',
  },
];

function getStatusTypes() {
  const types = STATUS_TYPES.map(type => ({ description: type.description, value: type.name }));
  return keyBy(types, type => type.value);
}

function getStatusKeys() {
  return STATUS_TYPES.map(type => type.name);
}

export { getStatusTypes, getStatusKeys };
