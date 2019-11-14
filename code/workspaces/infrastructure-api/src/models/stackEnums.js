export const status = Object.freeze({
  REQUESTED: 'requested',
  CREATING: 'creating',
  UNAVAILABLE: 'unavailable',
  READY: 'ready',
});

export const category = Object.freeze({
  ANALYSIS: 'analysis',
  PUBLISH: 'publish',
});

export const visibility = Object.freeze({
  PRIVATE: 'private',
  PROJECT: 'project',
  PUBLIC: 'public',
});

export const getEnumValues = e => Object.values(e);
