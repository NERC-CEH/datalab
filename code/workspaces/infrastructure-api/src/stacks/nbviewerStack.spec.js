import nbviewerStack from './nbviewerStack';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressApi from '../kubernetes/ingressApi';

jest.mock('../kubernetes/ingressApi');
ingressApi.deleteIngress = jest.fn().mockResolvedValue();

jest.mock('../kubernetes/serviceApi');
serviceApi.deleteService = jest.fn().mockResolvedValue();
jest.mock('../kubernetes/deploymentApi');
deploymentApi.deleteDeployment = jest.fn().mockResolvedValue();

describe('nbviewerStack', () => {
  describe('deleteNbViewerStack', () => {
    it('calls expected apis', async () => {
      // Arrange
      const params = {
        projectKey: 'project-key',
        name: 'test-site',
        type: 'nbviewer',
      };

      // Act
      await nbviewerStack.deleteNbViewerStack(params);

      // Assert
      expect(ingressApi.deleteIngress).toBeCalledWith('nbviewer-test-site', 'project-key');
      expect(serviceApi.deleteService).toBeCalledWith('nbviewer-test-site', 'project-key');
      expect(deploymentApi.deleteDeployment).toBeCalledWith('nbviewer-test-site', 'project-key');
    });
  });
});
