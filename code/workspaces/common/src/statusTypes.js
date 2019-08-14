import { keyBy, capitalize } from 'lodash';

const REQUESTED = 'requested';
const CREATING = 'creating';
const READY = 'ready';
const UNAVAILABLE = 'unavailable';

const STATUS_TYPES = [
  {
    name: REQUESTED,
    description: 'Resource has been requested',
    color: '#bbdefb',
    invertColor: true,
  },
  {
    name: CREATING,
    description: 'Resource is being created',
    color: '#2196f3',
  },
  {
    name: READY,
    description: 'Resource is ready for use',
    color: '#4caf50',
  },
  {
    name: UNAVAILABLE,
    description: 'Resource is currently unavailable',
    color: '#fdd835',
    invertColor: true,
  },
];

function getStatusTypes() {
  const types = STATUS_TYPES.map(({ name, description, color, invertColor }) => ({
    description,
    color,
    invertColor,
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
