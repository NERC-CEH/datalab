import data from './storage_config.json';

export function storageTypes() {
  return Object.entries(data.types)
    .map(([key]) => key);
}

export function storageCreationAllowedTypes() {
  return data.creationOptions.allowedTypes;
}

export function storageClass(type) {
  return data.types[type].storageClass;
}
