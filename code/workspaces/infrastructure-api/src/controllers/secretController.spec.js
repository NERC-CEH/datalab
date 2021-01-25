import { matchedData, query } from 'express-validator';
import logger from '../config/logger';
import { getCoreV1Api } from '../kubernetes/kubeConfig';
import { decodeSecretData, getStackSecret, readSecret } from './secretController';

jest.mock('express-validator');
query.mockReturnValue({ optional: jest.fn() });

jest.mock('../config/logger');
logger.error = jest.fn();

jest.mock('../kubernetes/kubeConfig');
const k8sApiMock = { readNamespacedSecret: jest.fn() };
getCoreV1Api.mockReturnValue(k8sApiMock);

const getRawSecretData = () => ({
  key1: 'secret value for key 1',
  KeyTwo: JSON.stringify({
    description: 'some more complex data', users: ['userOne', 'userTwo'],
  }),
});

const getSecret = () => ({
  apiVersion: 'v1',
  kind: 'Secret',
  metadata: {
    name: 'test-secret',
    annotations: { 'datalab/type': 'stack-secret' },
  },
  type: 'opaque',
  data: base64EncodeObjectValues(getRawSecretData()),
});

k8sApiMock.readNamespacedSecret.mockResolvedValue({ body: getSecret() });

// this structure is used to handle the chaining of response function calls
// e.g. response.status(404).send()
const responseMock = {
  status: jest.fn(),
  send: jest.fn(),
};
Object.values(responseMock).forEach(mock => mock.mockReturnValue(responseMock));

describe('getStackSecret', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const stackName = 'test-stack';
  const stackType = 'jupyter';
  const projectKey = 'test-project';

  matchedData.mockReturnValue({ stackName, stackType, projectKey });

  it('sends secret data if it exists and is annotated as being a stack secret', async () => {
    await getStackSecret(jest.fn(), responseMock);
    expect(responseMock.send).toHaveBeenCalledWith(getRawSecretData());
  });

  it('returns 404 if the requested secret exists but does not have the necessary metadata', async () => {
    const secretMissingAnnotations = { ...getSecret() };
    secretMissingAnnotations.metadata.annotations = { };
    k8sApiMock.readNamespacedSecret.mockResolvedValueOnce(secretMissingAnnotations);

    await getStackSecret(jest.fn(), responseMock);

    expect(responseMock.status).toHaveBeenCalledWith(404);
    expect(responseMock.send).toHaveBeenCalled();
  });

  it('returns only specified key of secret is key is specified in request', async () => {
    const key = 'key1';
    matchedData.mockReturnValueOnce({ stackName, stackType, projectKey, key });

    await getStackSecret(jest.fn(), responseMock);

    expect(responseMock.send).toHaveBeenCalledWith(getRawSecretData()[key]);
  });
});

describe('readSecret', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const secretName = 'test-secret';
  const projectKey = 'test-project';

  it('calls k8s api to read the value of the specified secret returning secret if successful, not sending a response', async () => {
    const result = await readSecret(responseMock, secretName, projectKey);
    expect(k8sApiMock.readNamespacedSecret).toHaveBeenCalledWith(secretName, projectKey);
    expect(result).toEqual(getSecret());
    expect(responseMock.status).not.toHaveBeenCalled();
    expect(responseMock.send).not.toHaveBeenCalled();
  });

  it('returns response with same status code as error when error occurs and logs error message', async () => {
    k8sApiMock.readNamespacedSecret.mockRejectedValueOnce({
      response: {
        statusMessage: 'Not found',
        statusCode: 404,
      },
    });

    await readSecret(responseMock, secretName, projectKey);

    expect(logger.error).toHaveBeenCalledWith(`Unable to read stack secret ${secretName} in project ${projectKey} with error: {code: 404, message: Not found}.`);
    expect(responseMock.status).toHaveBeenCalledWith(404);
    expect(responseMock.send).toHaveBeenCalled();
  });
});

describe('decodeSecretData', () => {
  it('returns the data having unencoded values from base64 encoding', () => {
    expect(decodeSecretData(getSecret().data)).toEqual(getRawSecretData());
  });
});

function base64EncodeObjectValues(object) {
  return Object.entries(object).reduce(
    (encodedObject, [key, value]) => ({
      ...encodedObject,
      [key]: Buffer.from(value).toString('base64'),
    }),
    {},
  );
}
