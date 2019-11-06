import roleBindingApi from './roleBindingApi';
import serviceAccountApi from './serviceAccountApi';
import projectRBACManager from './projectRBACManager';

jest.mock('./roleBindingApi');
jest.mock('./serviceAccountApi');

const projectKey = 'testproj';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createProjectComputeRBAC', () => {
  it('calls to create a project compute ServiceAccount', async () => {
    await projectRBACManager.createProjectComputeRBAC(projectKey);
    expect(serviceAccountApi.createNamespacedServiceAccount).toHaveBeenCalledWith(
      `${projectKey}-compute-submission-account`,
      projectKey,
    );
  });

  it('calls to create the correct RoleBinding in the project compute namespace', async () => {
    await projectRBACManager.createProjectComputeRBAC(projectKey);
    expect(roleBindingApi.createNamespacedRoleBinding).toHaveBeenCalledTimes(1);
    expect(roleBindingApi.createNamespacedRoleBinding.mock.calls[0]).toMatchSnapshot();
  });
});

describe('deleteProjectComputeRBAC', () => {
  it('calls to delete the project compute ServiceAccount', async () => {
    await projectRBACManager.deleteProjectComputeRBAC(projectKey);
    expect(serviceAccountApi.deleteNamespacedServiceAccount).toHaveBeenCalledWith(
      `${projectKey}-compute-submission-account`,
      `${projectKey}`,
    );
  });

  it('calls to delete the correct RoleBinding in the project compute namespace', async () => {
    await projectRBACManager.deleteProjectComputeRBAC(projectKey);
    expect(roleBindingApi.deleteNamespacedRoleBinding).toHaveBeenCalledWith(
      `${projectKey}-compute-submission-account-role-binding`,
      `${projectKey}-compute`,
    );
  });
});
