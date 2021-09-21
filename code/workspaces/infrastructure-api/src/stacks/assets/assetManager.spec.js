import { mountAssetsOnDeployment } from './assetManager';
import deploymentApi from '../../kubernetes/deploymentApi';
import centralAssetRepoRepository from '../../dataaccess/centralAssetRepoRepository';

jest.mock('../../kubernetes/deploymentApi');
jest.mock('../../dataaccess/centralAssetRepoRepository');

const projectKey = 'testproj';
const deploymentName = 'test-notebook';
const containerNameWithMounts = 'jupyter-container';
const testVolumeName = 'test-volume';

const getCurrentDeployment = (initialAssetIds) => {
  const assetVolumes = initialAssetIds.map(assetId => ({ name: `asset-${assetId}-initial` }));
  return {
    metadata: {
      name: deploymentName,
    },
    spec: {
      template: {
        spec: {
          volumes: [
            {
              name: testVolumeName,
              persistentVolumeClaim: {
                claimName: 'test-volume-claim',
              },
            },
            ...assetVolumes,
          ],
          containers: [
            {
              name: containerNameWithMounts,
              volumeMounts: [
                {
                  name: testVolumeName,
                  mountPath: '/data',
                },
                ...assetVolumes,
              ],
            },
            { name: 'supporting-container' },
          ],
        },
      },
    },
  };
};

const buildExpectedPatch = (assetIds) => {
  const patch = getCurrentDeployment([]);
  delete patch.metadata;

  patch.spec.template.spec.volumes = [
    ...patch.spec.template.spec.volumes,
    ...assetIds.map(id => ({
      name: `asset-${id}`,
      nfs: {
        path: `/central-asset-repository/nfs/asset_${id}`,
        readOnly: true,
        server: '192.168.3.16',
      },
    }))];

  const stackContainerIndex = patch.spec.template.spec.containers.findIndex(container => container.name === containerNameWithMounts);
  patch.spec.template.spec.containers[stackContainerIndex].volumeMounts = [
    ...patch.spec.template.spec.containers[stackContainerIndex].volumeMounts,
    ...assetIds.map(id => ({
      name: `asset-${id}`,
      readOnly: true,
      mountPath: `/assets/asset_${id}`,
    }))];

  return patch;
};

describe('assetManager', () => {
  describe('mountAssetsOnDeployment', () => {
    let params;

    beforeEach(() => {
      jest.resetAllMocks();

      params = {
        projectKey,
        deploymentName,
        containerNameWithMounts,
        assetIds: ['1234', '5678'],
      };

      centralAssetRepoRepository.getMetadataWithIds
        .mockImplementation(ids => ids.map(assetId => ({ assetId, fileLocation: `asset_${assetId}` })));
    });

    it('creates the correct patch configuration for existing assets', async () => {
      deploymentApi.getDeployment.mockResolvedValueOnce(getCurrentDeployment(['0001', '0002', '0003']));

      await mountAssetsOnDeployment(params);

      const expectedPatch = buildExpectedPatch(['1234', '5678']);
      expect(deploymentApi.mergePatchDeployment).toBeCalledWith(deploymentName, projectKey, expectedPatch);
    });

    it('creates the correct patch configuration if no existing assets', async () => {
      deploymentApi.getDeployment.mockResolvedValueOnce(getCurrentDeployment([]));

      await mountAssetsOnDeployment(params);

      const expectedPatch = buildExpectedPatch(['1234', '5678']);
      expect(deploymentApi.mergePatchDeployment).toBeCalledWith(deploymentName, projectKey, expectedPatch);
    });

    it('creates the correct patch configuration if removing assets', async () => {
      deploymentApi.getDeployment.mockResolvedValueOnce(getCurrentDeployment(['0001', '0002', '0003']));

      params.assetIds = [];
      await mountAssetsOnDeployment(params);

      const expectedPatch = buildExpectedPatch([]);
      expect(deploymentApi.mergePatchDeployment).toBeCalledWith(deploymentName, projectKey, expectedPatch);
    });

    it('creates the correct patch configuration if no existing volumes', async () => {
      const currentDeployment = getCurrentDeployment(['0001', '0002', '0003']);
      delete currentDeployment.spec.template.spec.volumes;
      const stackContainerIndex = currentDeployment.spec.template.spec.containers.findIndex(container => container.name === containerNameWithMounts);
      delete currentDeployment.spec.template.spec.containers[stackContainerIndex].volumeMounts;
      deploymentApi.getDeployment.mockResolvedValueOnce(currentDeployment);

      await mountAssetsOnDeployment(params);

      const expectedPatch = buildExpectedPatch(['1234', '5678']);
      expectedPatch.spec.template.spec.volumes = expectedPatch.spec.template.spec.volumes.filter(v => v.name !== 'test-volume');
      const mainContainer = expectedPatch.spec.template.spec.containers[stackContainerIndex];
      mainContainer.volumeMounts = mainContainer.volumeMounts.filter(v => v.name !== 'test-volume');
      expect(deploymentApi.mergePatchDeployment).toBeCalledWith(deploymentName, projectKey, expectedPatch);
    });

    it('throws if no deployment found', async () => {
      deploymentApi.getDeployment.mockResolvedValueOnce(undefined);

      await expect(mountAssetsOnDeployment(params))
        .rejects.toEqual(new Error('Could not mount assets on Stack. No deployment with name: test-notebook in namespace: testproj'));
    });
  });
});
