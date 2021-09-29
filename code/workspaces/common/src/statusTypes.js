import { keyBy, capitalize } from 'lodash';

const REQUESTED = 'requested';
const CREATING = 'creating';
const READY = 'ready';
const SUSPENDED = 'suspended';
const UNAVAILABLE = 'unavailable';

const STATUS_TYPES = [
  {
    name: REQUESTED,
    description: 'Resource has been requested',
    backgroundColor: 'hsl(190, 55%, 85%)',
    color: 'hsl(190, 90%, 15%)',
  },
  {
    name: CREATING,
    description: 'Resource is being created',
    backgroundColor: 'hsl(65, 70%, 80%)',
    color: 'hsl(65, 100%, 12%)',
  },
  {
    name: READY,
    description: 'Resource is ready for use',
    backgroundColor: 'hsl(120, 55%, 80%)',
    color: 'hsl(120, 90%, 12%)',
  },
  {
    name: SUSPENDED,
    description: 'Resource is suspended',
    backgroundColor: 'hsl(190, 55%, 85%)',
    color: 'hsl(190, 90%, 15%)',
  },
  {
    name: UNAVAILABLE,
    description: 'Resource is currently unavailable',
    backgroundColor: 'hsl(355, 65%, 90%)',
    color: 'hsl(355, 100%, 22%)',
  },
];

function getStatusTypes() {
  const types = STATUS_TYPES.map(({ name, description, backgroundColor, color }) => ({
    description,
    backgroundColor,
    color,
    displayName: capitalize(name),
    value: name,
  }));
  return keyBy(types, type => type.value);
}

function getStatusKeys() {
  return STATUS_TYPES.map(type => type.name);
}

function getStatusProps(status) {
  return getStatusTypes()[status];
}

export {
  CREATING,
  READY,
  REQUESTED,
  UNAVAILABLE,
  getStatusKeys,
  getStatusProps,
  getStatusTypes,
};
