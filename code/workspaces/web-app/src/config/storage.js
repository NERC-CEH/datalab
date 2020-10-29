import axios from 'axios';

let cachedData;

async function storageConfig() {
  if (cachedData) {
    return cachedData;
  }

  const { data } = await axios.get('/storage_config.json');
  cachedData = data;
  return cachedData;
}

export async function storageTypes() {
  const data = await storageConfig();
  return Object.keys(data.types);
}

export async function storageCreationDefaultType() {
  const data = await storageConfig();
  return data.creationOptions.defaultType;
}

export async function storageCreationAllowedDisplayOptions() {
  const data = await storageConfig();
  return data.creationOptions.allowedTypes
    .map(type => ({
      text: data.types[type].displayValue,
      value: type,
    }));
}

export async function storageDisplayValue(type) {
  const data = await storageConfig();
  return data.types[type].displayValue;
}

export async function storageDescription(type) {
  const data = await storageConfig();
  return data.types[type].description;
}
