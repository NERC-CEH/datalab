import { matchedData } from 'express-validator';
import clustersRepository from '../dataaccess/clustersRepository';
import { getSchedulerServiceName, createClusterStack, deleteClusterStack } from '../stacks/clusterManager';

function requestCluster(request) {
  const params = matchedData(request);
  const cluster = {
    type: params.type,
    projectKey: params.projectKey,
    name: params.name,
    displayName: params.displayName,
    volumeMount: params.volumeMount,
    condaPath: params.condaPath,
    maxWorkers: params.maxWorkers,
    maxWorkerMemoryGb: params.maxWorkerMemoryGb,
    maxWorkerCpu: params.maxWorkerCpu,
  };
  return cluster;
}

async function createCluster(request, response, next) {
  const cluster = requestCluster(request);

  if (await handleExistingCluster(cluster, response, next)) return response;

  try {
    const schedulerServiceName = getSchedulerServiceName(cluster.name, cluster.type);
    const schedulerAddress = `tcp://${schedulerServiceName}:8786`;
    const createdCluster = await clustersRepository.createCluster({ ...cluster, schedulerAddress });
    await createClusterStack(cluster);
    return response.status(201).send(createdCluster);
  } catch (error) {
    return next(new Error(`Error creating cluster - failed to create new document: ${error.message}`));
  }
}

async function deleteCluster(request, response, next) {
  const cluster = requestCluster(request);

  try {
    const result = await clustersRepository.deleteCluster(cluster);
    await deleteClusterStack(cluster);
    if (result.n === 0) {
      return response.status(404).send(cluster);
    }
    return response.status(200).send(cluster);
  } catch (error) {
    return next(new Error(`Error deleting cluster: ${error.message}`));
  }
}

async function handleExistingCluster(cluster, response, next) {
  try {
    const existErrors = await clustersRepository.clusterExists(cluster);
    if (existErrors) {
      return response.status(409).send({ message: existErrors });
    }
  } catch (error) {
    next(new Error(`Error creating cluster - failed to check if document already exists: ${error.message}`));
  }
  return null;
}

async function listByProject(request, response, next) {
  const { projectKey } = matchedData(request);

  try {
    const clusters = await clustersRepository.listByProject(projectKey);
    return response.status(200).send(clusters);
  } catch (error) {
    return next(new Error(`Error listing clusters: ${error.message}`));
  }
}

async function listByMount(request, response, next) {
  const { projectKey, volumeMount } = matchedData(request);

  try {
    const clusters = await clustersRepository.getByVolumeMount(projectKey, volumeMount);
    return response.status(200).send(clusters);
  } catch (error) {
    return next(new Error(`Error listing clusters: ${error.message}`));
  }
}

export default {
  createCluster,
  deleteCluster,
  listByProject,
  listByMount,
};
