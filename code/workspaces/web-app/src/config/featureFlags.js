import axios from 'axios';

// This is a cached value.
// Initialise asynchronously before React starts.
// Get synchronously within React.
let featureFlags = {
  requestProjects: false,
};

async function initialiseFeatureFlags() {
  const { data } = await axios.get('/feature_flags_config.json');
  featureFlags = data;
}

const getFeatureFlags = () => (featureFlags);

export { initialiseFeatureFlags, getFeatureFlags };
