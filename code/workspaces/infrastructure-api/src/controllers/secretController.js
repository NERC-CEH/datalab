import { check, matchedData } from 'express-validator';
import { getCoreV1Api } from '../kubernetes/kubeConfig';
import nameGenerators from '../common/nameGenerators';
import metadataGenerators from '../common/metadataGenerators';

const k8sApi = getCoreV1Api();

export async function getStackSecret(request, response) {
  const { projectKey, stackName, stackType } = matchedData(request);
  const { body: secret } = await k8sApi.readNamespacedSecret(nameGenerators.deploymentName(stackName, stackType), projectKey);
  const isStackSecret = metadataGenerators
    .checkResourceHasMetadataFromGenerator(secret, metadataGenerators.stackSecretMetadata);

  if (isStackSecret) {
    response.send(decodeSecretData(secret.data));
  } else {
    response.status(404).send();
  }
}

function decodeSecretData(data) {
  // The values in a kubernetes secret have to be base64 encoded. This function decodes the values.
  return Object.entries(data).reduce(
    (decodedData, [key, value]) => ({
      ...decodedData,
      [key]: Buffer.from(value, 'base64').toString(),
    }),
    {},
  );
}

export const stackSecretValidator = [
  check('projectKey', 'projectKey must be specified for stack secret request'),
  check('stackName', 'stackName must be specified for the stack secret request'),
  check('stackType', 'stackType must be specified for the stack secret request'),
];
