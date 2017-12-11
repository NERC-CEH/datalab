import stackRepository from '../dataaccess/stackRepository';
import { generateCreateElement, generateDeleteElement } from './infrastructureApiGenerators';

const baseConfig = {
  apiRoute: 'stacks',
  elementName: 'stack',
  elementRepository: stackRepository,
};

const createStack = generateCreateElement({
  ...baseConfig,
  generateApiRequest: (stack, datalabInfo) => ({
    ...stack,
    url: `https://${datalabInfo.name}-${stack.name}.${datalabInfo.domain}`,
    internalEndpoint: `http://${stack.type}-${stack.name}`,
  }),
  generateApiPayload: (stackRequest, datalabInfo) => ({
    datalabInfo,
    name: stackRequest.name,
    type: stackRequest.type,
    sourcePath: stackRequest.sourcePath,
    isPublic: true,
  }),
});

const deleteStack = generateDeleteElement({
  ...baseConfig,
  generateApiPayload: (stack, datalabInfo) => ({
    datalabInfo,
    name: stack.name,
    type: stack.type,
  }),
});

export default { createStack, deleteStack };
