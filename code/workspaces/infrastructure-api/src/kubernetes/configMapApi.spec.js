import { loadYaml } from '@kubernetes/client-node';
import { getCoreV1Api } from './kubeConfig';
import configMapApi from './configMapApi';

jest.mock('./kubeConfig');

const k8sApiMock = {
  readNamespacedConfigMap: jest.fn(),
  createNamespacedConfigMap: jest.fn(),
  deleteNamespacedConfigMap: jest.fn(),
};

getCoreV1Api.mockReturnValue(k8sApiMock);

const name = 'test-name';
const namespace = 'test-namespace';
const manifest = getManifest();
const configMap = getConfigMap();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('namespacedConfigMapExists', () => {
  it('returns true if reading config map is successful', async () => {
    expect(
      await configMapApi.namespacedConfigMapExists(name, namespace),
    ).toEqual(true);
  });

  it('returns false if reading config map is unsuccessful', async () => {
    k8sApiMock.readNamespacedConfigMap.mockImplementationOnce(
      () => { throw new Error('expected test error'); },
    );
    expect(
      await configMapApi.namespacedConfigMapExists(name, namespace),
    ).toEqual(false);
  });
});

describe('createOrReplaceNamespacedConfigMap', () => {
  // I don't like having to rely on the underlying implementation of the functions
  // that should be called by this one to check that they have been called or not, but
  // there is no other way I can seem to do it using Jest.

  it('replaces config map if it already exists', async () => {
    // Make check for config map existence return true
    k8sApiMock.readNamespacedConfigMap.mockImplementationOnce(() => { });

    await configMapApi.createOrReplaceNamespacedConfigMap(name, namespace, manifest);

    // for replacement existing config map should have been deleted before creating new one
    expect(k8sApiMock.deleteNamespacedConfigMap).toHaveBeenCalledWith(name, namespace);
    expect(k8sApiMock.createNamespacedConfigMap).toHaveBeenCalledWith(namespace, configMap);
  });

  it('creates config map if it does not already exists', async () => {
    // Make check for config map existence return false
    k8sApiMock.readNamespacedConfigMap.mockImplementationOnce(() => { throw new Error('expected test error'); });

    await configMapApi.createOrReplaceNamespacedConfigMap(name, namespace, manifest);

    // for only creation there is no need to delete anything beforehand
    expect(k8sApiMock.deleteNamespacedConfigMap).not.toHaveBeenCalled();
    expect(k8sApiMock.createNamespacedConfigMap).toHaveBeenCalledTimes(1);
  });
});

describe('createNamespacedConfigMap', () => {
  it('calls k8s api with correct namespace and configMap arguments', async () => {
    await configMapApi.createNamespacedConfigMap(name, namespace, manifest);
    expect(k8sApiMock.createNamespacedConfigMap).toHaveBeenCalledWith(namespace, configMap);
  });
});

describe('replaceNamespacedConfigMap', () => {
  it('deletes existing config map before creating it again with provided manifest', async () => {
    await configMapApi.replaceNamespacedConfigMap(name, namespace, manifest);

    expect(k8sApiMock.deleteNamespacedConfigMap).toHaveBeenCalledWith(name, namespace);
    expect(k8sApiMock.createNamespacedConfigMap).toHaveBeenCalledWith(namespace, configMap);
  });
});

describe('deleteNamespacedConfigMap', () => {
  it('deletes the configMap with correct name and namespace if it exists', async () => {
    k8sApiMock.readNamespacedConfigMap.mockImplementationOnce(() => configMap);

    await configMapApi.deleteNamespacedConfigMap(name, namespace);
    expect(k8sApiMock.readNamespacedConfigMap)
      .toHaveBeenCalledWith(name, namespace);
    expect(k8sApiMock.deleteNamespacedConfigMap)
      .toHaveBeenCalledWith(name, namespace);
  });

  it('does not attempt to delete the configMap if it does not exist', async () => {
    k8sApiMock.readNamespacedConfigMap.mockImplementationOnce(() => { throw new Error('expected test error'); });
    await configMapApi.deleteNamespacedConfigMap(name, namespace);

    expect(k8sApiMock.readNamespacedConfigMap)
      .toHaveBeenCalledWith(name, namespace);
    expect(k8sApiMock.deleteNamespacedConfigMap)
      .not.toHaveBeenCalled();
  });
});

function getManifest() {
  return `
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: test-config-map
data:
  value1: hello
  value2: world
`;
}

function getConfigMap() {
  return loadYaml(getManifest());
}
