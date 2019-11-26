import { getCoreV1Api } from './kubeConfig';
import serviceAccountApi from './serviceAccountApi';

jest.mock('./kubeConfig');

const k8sApiMock = {
  createNamespacedServiceAccount: jest.fn(),
  deleteNamespacedServiceAccount: jest.fn(),
  readNamespacedServiceAccount: jest.fn(),
};

getCoreV1Api.mockReturnValue(k8sApiMock);

const projectKey = 'testproj';
const name = 'service-account';
const serviceAccount = { metadata: { name } };

describe('createNamespacedServiceAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls k8s api to create a namespaced service account if it does not exist', async () => {
    k8sApiMock.readNamespacedServiceAccount.mockImplementationOnce(() => { throw new Error('expected test error'); });
    await serviceAccountApi.createNamespacedServiceAccount(name, projectKey);

    expect(k8sApiMock.readNamespacedServiceAccount)
      .toHaveBeenCalledWith(name, projectKey);
    expect(k8sApiMock.createNamespacedServiceAccount)
      .toHaveBeenCalledWith(projectKey, serviceAccount);
  });

  it('does not attempt to create the serviceAccount if it exists', async () => {
    k8sApiMock.readNamespacedServiceAccount.mockImplementationOnce(() => serviceAccount);
    await serviceAccountApi.createNamespacedServiceAccount(name, projectKey);

    expect(k8sApiMock.readNamespacedServiceAccount)
      .toHaveBeenCalledWith(name, projectKey);
    expect(k8sApiMock.createNamespacedServiceAccount)
      .not.toHaveBeenCalled();
  });
});

describe('deleteNamespacedServiceAccount', () => {
  it('calls k8s api to delete namespaced service account', async () => {
    await serviceAccountApi.deleteNamespacedServiceAccount(name, projectKey);

    expect(k8sApiMock.deleteNamespacedServiceAccount)
      .toHaveBeenCalledWith(name, projectKey);
  });
});
