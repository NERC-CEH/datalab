import { getRbacV1Api } from './kubeConfig';
import roleBindingApi from './roleBindingApi';

jest.mock('./kubeConfig');

const k8sApiMock = {
  createNamespacedRoleBinding: jest.fn(),
  deleteNamespacedRoleBinding: jest.fn(),
};

getRbacV1Api.mockReturnValue(k8sApiMock);

const projectKey = 'testproj';

describe('createNamespacedRoleBinding', () => {
  const bindingDefinition = {
    metadata: { name: 'test-role-binding' },
    roleRef: {
      kind: 'Role',
      name: 'test-role',
    },
    subjects: [{
      kind: 'ServiceAccount',
      name: 'test-service-account',
    }],
  };

  it('calls to k8s api to make a namespaced roleBinding', async () => {
    await roleBindingApi.createNamespacedRoleBinding(bindingDefinition, projectKey);

    expect(k8sApiMock.createNamespacedRoleBinding)
      .toHaveBeenCalledWith(projectKey, bindingDefinition);
  });
});

describe('deleteNamespacedRoleBinding', () => {
  it('calls k8s api to delete a namespaced roleBinding', async () => {
    const bindingName = 'binding-name';
    await roleBindingApi.deleteNamespacedRoleBinding(bindingName, projectKey);
    expect(k8sApiMock.deleteNamespacedRoleBinding)
      .toHaveBeenCalledWith(bindingName, projectKey);
  });
});
