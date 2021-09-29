import axios from 'axios';

// This is a cached value.
// Initialise asynchronously before React starts.
// Get synchronously within React.
let cachedData;

export async function initialiseClusters() {
  const { data } = await axios.get('/clusters_config.json');
  cachedData = data;
}

export const getClusterMaxWorkers = type => cachedData[type.toLowerCase()].cluster.workersMax;
export const getWorkerMemoryMax = type => cachedData[type.toLowerCase()].workers.memoryMax_GB;
export const getWorkerCpuMax = type => cachedData[type.toLowerCase()].workers.CpuMax_vCPU;
export const getCondaRequired = type => cachedData[type.toLowerCase()].condaRequired;
