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

describe('createNamespacedServiceAccount', () => {
  it('calls k8s api to create a namespaced service account', async () => {
    const name = 'service-account';
    const serviceAccount = { metadata: { name } };
    k8sApiMock.readNamespacedServiceAccount.mockImplementationOnce(() => { throw new Error('expected test error'); });

    await serviceAccountApi.createNamespacedServiceAccount(name, projectKey);

    expect(k8sApiMock.readNamespacedServiceAccount)
      .toHaveBeenCalledWith(name, projectKey);
    expect(k8sApiMock.createNamespacedServiceAccount)
      .toHaveBeenCalledWith(projectKey, serviceAccount);
  });
});

describe('deleteNamespacedServiceAccount', () => {
  it('calls k8s api to delete namespaced service account', async () => {
    const name = 'service-account';
    await serviceAccountApi.deleteNamespacedServiceAccount(name, projectKey);

    expect(k8sApiMock.deleteNamespacedServiceAccount)
      .toHaveBeenCalledWith(name, projectKey);
  });
});
