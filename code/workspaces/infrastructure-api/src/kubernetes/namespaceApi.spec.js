import namespaceApi, { MANAGED_BY } from './namespaceApi';
import { getCoreV1Api } from './kubeConfig';

jest.mock('./kubeConfig');

const k8sApiMock = {
  readNamespace: jest.fn(),
  createNamespace: jest.fn(),
  deleteNamespace: jest.fn(),
};

getCoreV1Api.mockReturnValue(k8sApiMock);

const NAMESPACE = 'testnamespace';

describe('namespaceApi', () => {
  beforeEach(() => {
    k8sApiMock.readNamespace.mockReset();
    k8sApiMock.createNamespace.mockReset();
    k8sApiMock.deleteNamespace.mockReset();
  });

  describe('readNamespaceMetadata', () => {
    it('should return metadata correctly for a managed namespace', async () => {
      k8sApiMock.readNamespace.mockResolvedValue({
        body: { metadata: { labels: { managedBy: MANAGED_BY } } },
      });

      const namespaceInfo = await namespaceApi.readNamespaceMetadata(NAMESPACE);

      expect(namespaceInfo).toEqual({
        namespace: NAMESPACE,
        exists: true,
        managed: true,
      });
    });

    it('should return metadata correctly for an unmanaged namespace', async () => {
      k8sApiMock.readNamespace.mockResolvedValue({
        body: { metadata: { labels: {} } },
      });

      const namespaceInfo = await namespaceApi.readNamespaceMetadata(NAMESPACE);

      expect(namespaceInfo).toEqual({
        namespace: NAMESPACE,
        exists: true,
        managed: false,
      });
    });

    it('should return metadata correctly for a non existent namespace', async () => {
      k8sApiMock.readNamespace.mockRejectedValue('error');

      const namespaceInfo = await namespaceApi.readNamespaceMetadata('missing-namespace');

      expect(namespaceInfo).toEqual({
        namespace: 'missing-namespace',
        exists: false,
        managed: false,
      });
    });
  });

  describe('idempotent namespace create', () => {
    it('should return early if the namespace exists', async () => {
      k8sApiMock.readNamespace.mockResolvedValue({
        body: { metadata: { labels: { managedBy: MANAGED_BY } } },
      });

      await namespaceApi.idempotentCreateNamespace(NAMESPACE);

      expect(k8sApiMock.createNamespace).not.toBeCalled();
    });

    it('should create the namespace', async () => {
      k8sApiMock.readNamespace.mockRejectedValue('missing');
      k8sApiMock.createNamespace.mockResolvedValue('success');

      await namespaceApi.idempotentCreateNamespace(NAMESPACE);

      const expectedPayload = {
        metadata: {
          name: NAMESPACE,
          labels: {
            name: NAMESPACE,
            managedBy: MANAGED_BY,
          },
        },
      };
      expect(k8sApiMock.createNamespace).toBeCalledWith(expectedPayload);
    });

    it('should error if the namespace cant be created', async () => {
      k8sApiMock.readNamespace.mockRejectedValue('missing');
      k8sApiMock.createNamespace.mockRejectedValue({ response: { body: 'error' } });

      try {
        await namespaceApi.idempotentCreateNamespace(NAMESPACE);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toEqual({ response: { body: 'error' } });
      }
    });
  });

  describe('idempotent namespace delete', () => {
    it('should return early if the namespace does not exist', async () => {
      k8sApiMock.readNamespace.mockRejectedValue('missing');

      await namespaceApi.idempotentDeleteNamespace(NAMESPACE);

      expect(k8sApiMock.deleteNamespace).not.toBeCalled();
    });

    it('should delete the namespace', async () => {
      k8sApiMock.readNamespace.mockResolvedValue({
        body: { metadata: { labels: { managedBy: MANAGED_BY } } },
      });
      k8sApiMock.deleteNamespace.mockResolvedValue('success');

      await namespaceApi.idempotentDeleteNamespace(NAMESPACE);

      expect(k8sApiMock.deleteNamespace).toBeCalledWith(NAMESPACE);
    });

    it('should error if the namespace cant be created', async () => {
      k8sApiMock.readNamespace.mockResolvedValue({
        body: { metadata: { labels: { managedBy: MANAGED_BY } } },
      });
      k8sApiMock.deleteNamespace.mockRejectedValue({ response: { body: 'error' } });

      try {
        await namespaceApi.idempotentDeleteNamespace(NAMESPACE);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toEqual({ response: { body: 'error' } });
      }
    });
  });
});
