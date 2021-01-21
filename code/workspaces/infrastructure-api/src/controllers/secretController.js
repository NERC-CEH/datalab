import { query, matchedData } from 'express-validator';
import logger from '../config/logger';
import { getCoreV1Api } from '../kubernetes/kubeConfig';
import nameGenerators from '../common/nameGenerators';
import metadataGenerators from '../common/metadataGenerators';

const k8sApi = getCoreV1Api();

export async function getStackSecret(request, response) {
  const { projectKey, stackName, stackType, key } = matchedData(request);
  const secretName = nameGenerators.stackCredentialSecret(stackName, stackType);

  let secret;
  try {
    const { body } = await k8sApi.readNamespacedSecret(secretName, projectKey);
    secret = body;
  } catch (error) {
    const { response: { statusMessage: message, statusCode: code } } = error;
    const errorString = `{code: ${code}, message: ${message}}`;
    logger.error(
      `Unable to read stack secret ${secretName} in project ${projectKey} with error: ${errorString}.`,
    );
    response.status(code).send();
  }

  const isStackSecret = metadataGenerators
    .checkResourceHasMetadataFromGenerator(secret, metadataGenerators.stackSecretMetadata);

  if (isStackSecret) {
    const data = decodeSecretData(secret.data);
    response.send(key ? data[key] : data);
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
  query('projectKey', 'projectKey must be specified for stack secret request'),
  query('stackName', 'stackName must be specified for the stack secret request'),
  query('stackType', 'stackType must be specified for the stack secret request'),
  query('key').optional(),
];
