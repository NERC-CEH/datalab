import data from './storage_config.json';

export function storageTypes() {
  return Object.keys(data.types);
}

export function storageCreationAllowedTypes() {
  return data.creationOptions.allowedTypes;
}

export function storageClass(type) {
  return data.types[type].storageClass;
}
