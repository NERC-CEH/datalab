import siteStack from './siteStack';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressApi from '../kubernetes/ingressApi';
import * as stackBuilders from './stackBuilders';

jest.spyOn(stackBuilders, 'createDeployment').mockReturnValue(() => jest.fn().mockResolvedValue());
jest.spyOn(stackBuilders, 'createService').mockReturnValue(() => jest.fn().mockResolvedValue());
jest.spyOn(stackBuilders, 'createIngressRule').mockReturnValue(() => jest.fn().mockResolvedValue());

jest.mock('../kubernetes/ingressApi');
ingressApi.deleteIngress = jest.fn().mockResolvedValue();

jest.mock('../kubernetes/serviceApi');
serviceApi.deleteService = jest.fn().mockResolvedValue();
jest.mock('../kubernetes/deploymentApi');
deploymentApi.deleteDeployment = jest.fn().mockResolvedValue();

describe('siteStack', () => {
  describe('createSiteStack', () => {
    it('calls expected apis', async () => {
      // Arrange
      const params = {
        projectKey: 'project-key',
        name: 'test-site',
        type: 'rshiny',
      };

      // Act
      await siteStack.createSiteStack(params);

      // Assert
      expect(stackBuilders.createDeployment).toBeCalledWith(params, expect.any(Function));
      expect(stackBuilders.createService).toBeCalledWith(params, expect.any(Function));
      expect(stackBuilders.createIngressRule).toBeCalledWith(params, expect.any(Function));
    });
  });

  describe('deleteSiteStack', () => {
    it('calls expected apis', async () => {
      // Arrange
      const params = {
        projectKey: 'project-key',
        name: 'test-site',
        type: 'rshiny',
      };

      // Act
      await siteStack.deleteSiteStack(params);

      // Assert
      expect(ingressApi.deleteIngress).toBeCalledWith('rshiny-test-site', 'project-key');
      expect(serviceApi.deleteService).toBeCalledWith('rshiny-test-site', 'project-key');
      expect(deploymentApi.deleteDeployment).toBeCalledWith('rshiny-test-site', 'project-key');
    });
  });
});
