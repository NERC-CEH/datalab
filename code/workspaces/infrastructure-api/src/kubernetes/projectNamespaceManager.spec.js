import projectNamespaceManager from './projectNamespaceManager';
import namespaceApi from './namespaceApi';

jest.mock('./namespaceApi');

const NAMESPACE = 'testnamespace';

describe('projectNamespaceManager', () => {
  describe('idempotentCreateProjectNamespaces', () => {
    it('returns a resolved project if successful', async () => {
      namespaceApi.idempotentCreateNamespace.mockResolvedValue();

      await projectNamespaceManager.idempotentCreateProjectNamespaces(NAMESPACE);

      expect(namespaceApi.idempotentCreateNamespace).toHaveBeenCalledTimes(2);
    });

    it('returns a rejected promise if unsuccessful', async () => {
      namespaceApi.idempotentCreateNamespace.mockRejectedValue('error');

      try {
        await projectNamespaceManager.idempotentCreateProjectNamespaces(NAMESPACE);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toEqual('error');
      }
    });
  });

  describe('checkForbiddenNamespaces', () => {
    it('returns true if namespace is forbidden', async () => {
      namespaceApi.readNamespaceMetadata.mockResolvedValue({ exists: true, managed: false });

      const isForbidden = await projectNamespaceManager.checkForbiddenNamespaces(NAMESPACE);

      expect(isForbidden).toBe(true);
    });

    it('returns false if namespace is not forbidden', async () => {
      namespaceApi.readNamespaceMetadata.mockResolvedValue({ exists: true, managed: true });

      const isForbidden = await projectNamespaceManager.checkForbiddenNamespaces(NAMESPACE);

      expect(isForbidden).toBe(false);
    });
  });

  describe('idempotentDeleteProjectNamespaces', () => {
    it('returns a resolved project if successful', async () => {
      namespaceApi.idempotentDeleteNamespace.mockResolvedValue();

      await projectNamespaceManager.idempotentDeleteProjectNamespaces(NAMESPACE);

      expect(namespaceApi.idempotentDeleteNamespace).toHaveBeenCalledTimes(2);
    });

    it('returns a rejected promise if unsuccessful', async () => {
      namespaceApi.idempotentDeleteNamespace.mockRejectedValue('error');

      try {
        await projectNamespaceManager.idempotentDeleteProjectNamespaces(NAMESPACE);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toEqual('error');
      }
    });
  });
});
