import { generateCreateElement, generateDeleteElement } from './infrastructureApiGenerators';
import stackRepository from '../dataaccess/stackRepository';

/**
 * Promise chain sequence for the infrastructure API is common between data
 * storage and stacks. The code for this has been refactored to generator
 * functions, for create and delete. The infrastructure API requests and
 * payloads are different for data storage and stacks; these are created using
 * functions that are given as part of the configuration.
 * */

const baseConfig = {
  apiRoute: 'stacks',
  elementName: 'stack',
  elementRepository: stackRepository,
};

export const createStackRequest = (stack, datalabInfo) => ({
  ...stack,
  url: `https://${datalabInfo.name}-${stack.name}.${datalabInfo.domain}`,
  internalEndpoint: `http://${stack.type}-${stack.name}`,
});

export const createStackPayload = (stackRequest, datalabInfo) => ({
  datalabInfo,
  name: stackRequest.name,
  type: stackRequest.type,
  sourcePath: stackRequest.sourcePath,
  isPublic: true,
});

export const deleteStackPayload = (stack, datalabInfo) => ({
  datalabInfo,
  name: stack.name,
  type: stack.type,
});

const createStack = generateCreateElement({
  ...baseConfig,
  generateApiRequest: createStackRequest,
  generateApiPayload: createStackPayload,
});

const deleteStack = generateDeleteElement({
  ...baseConfig,
  generateApiPayload: deleteStackPayload,
});

export default { createStack, deleteStack };
