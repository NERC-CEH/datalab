import rshinyStack from './rshinyStack';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressApi from '../kubernetes/ingressApi';

jest.mock('../kubernetes/ingressApi');
ingressApi.deleteIngress = jest.fn().mockResolvedValue();

jest.mock('../kubernetes/serviceApi');
serviceApi.deleteService = jest.fn().mockResolvedValue();
jest.mock('../kubernetes/deploymentApi');
deploymentApi.deleteDeployment = jest.fn().mockResolvedValue();

describe('rshinyStack', () => {
  describe('deleteRShinyStack', () => {
    it('calls expected apis', async () => {
      // Arrange
      const params = {
        projectKey: 'project-key',
        name: 'test-site',
        type: 'rshiny',
      };

      // Act
      await rshinyStack.deleteRShinyStack(params);

      // Assert
      expect(ingressApi.deleteIngress).toBeCalledWith('rshiny-test-site', 'project-key');
      expect(serviceApi.deleteService).toBeCalledWith('rshiny-test-site', 'project-key');
      expect(deploymentApi.deleteDeployment).toBeCalledWith('rshiny-test-site', 'project-key');
    });
  });
});
