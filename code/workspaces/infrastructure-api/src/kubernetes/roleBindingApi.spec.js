import { getRbacV1Api } from './kubeConfig';
import roleBindingApi from './roleBindingApi';

jest.mock('./kubeConfig');

const k8sApiMock = {
  createNamespacedRoleBinding: jest.fn(),
  deleteNamespacedRoleBinding: jest.fn(),
  readNamespacedRoleBinding: jest.fn(),
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls k8s api to delete a namespaced roleBinding', async () => {
    const bindingName = 'binding-name';
    await roleBindingApi.deleteNamespacedRoleBinding(bindingName, projectKey);
    expect(k8sApiMock.deleteNamespacedRoleBinding)
      .toHaveBeenCalledWith(bindingName, projectKey);
  });

  it('does not call k8s api to delete a namespaced roleBinding if it does not exist', async () => {
    const bindingName = ' binding-name';
    k8sApiMock.readNamespacedRoleBinding.mockImplementationOnce(() => { throw new Error('expected test error'); });

    await roleBindingApi.deleteNamespacedRoleBinding(bindingName, projectKey);
    expect(k8sApiMock.deleteNamespacedRoleBinding)
      .not.toHaveBeenCalled();
  });
});
