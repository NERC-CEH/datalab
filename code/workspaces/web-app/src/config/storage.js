import axios from 'axios';

// This is a cached value.
// Initialise asynchronously before React starts.
// Get synchronously within React.
let cachedData;

async function initialiseStorage() {
  const { data } = await axios.get('/storage_config.json');
  cachedData = data;
}

const storageCreationDefaultType = () => cachedData.creationOptions.defaultType;
const storageDisplayValue = type => cachedData.types[type].displayValue;
const storageDescription = type => cachedData.types[type].description;
const storageCreationAllowedDisplayOptions = () => cachedData.creationOptions.allowedTypes
  .map(type => ({
    text: cachedData.types[type].displayValue,
    value: type,
  }));

export { initialiseStorage, storageCreationDefaultType, storageCreationAllowedDisplayOptions, storageDisplayValue, storageDescription };
