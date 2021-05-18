import rstudioStack from './rstudioStack';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import ingressGenerator from '../kubernetes/ingressGenerator';
import secretManager from '../credentials/secretManager';
import * as stackBuilders from './stackBuilders';
import ingressApi from '../kubernetes/ingressApi';
import serviceApi from '../kubernetes/serviceApi';
import deploymentApi from '../kubernetes/deploymentApi';
import configMapApi from '../kubernetes/configMapApi';

jest.mock('../credentials/secretManager');
const credentials = { token: 'a-token' };
secretManager.createNewUserCredentials = jest.fn().mockReturnValue(credentials);
secretManager.createStackCredentialSecret = jest.fn().mockResolvedValue();
secretManager.deleteStackCredentialSecret = jest.fn().mockResolvedValue();

jest.mock('./stackBuilders');
stackBuilders.createPySparkConfigMap = jest.fn().mockReturnValue(() => {});
stackBuilders.createDaskConfigMap = jest.fn().mockReturnValue(() => {});
stackBuilders.createRStudioConfigMap = jest.fn().mockReturnValue(() => {});
stackBuilders.createDeployment = jest.fn().mockReturnValue(() => {});
stackBuilders.createSparkDriverHeadlessService = jest.fn().mockReturnValue(() => {});
stackBuilders.createService = jest.fn().mockReturnValue(() => {});
stackBuilders.createIngressRule = jest.fn().mockReturnValue(() => {});

jest.mock('../kubernetes/ingressApi');
ingressApi.deleteIngress = jest.fn().mockResolvedValue();

jest.mock('../kubernetes/serviceApi');
serviceApi.deleteService = jest.fn().mockResolvedValue();

jest.mock('../kubernetes/deploymentApi');
deploymentApi.deleteDeployment = jest.fn().mockResolvedValue();

jest.mock('../kubernetes/configMapApi');
configMapApi.deleteNamespacedConfigMap = jest.fn().mockResolvedValue();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('rstudioStack', () => {
  describe('createRStudioStack', () => {
    it('creates expected resources', async () => {
      // Arrange
      const name = 'name';
      const type = 'rstudio-nb';
      const projectKey = 'projectKey';
      const params = { name, type, projectKey };
      const proxyTimeout = '1800';
      const rewriteTarget = '/$2';
      const pathPattern = '(/|$)(.*)';

      // Act
      await rstudioStack.createRStudioStack(params);

      // Assert
      expect(secretManager.createNewUserCredentials).toBeCalledWith();
      expect(secretManager.createStackCredentialSecret).toBeCalledWith(name, type, projectKey, credentials);
      expect(stackBuilders.createRStudioConfigMap).toBeCalledWith(params);
      expect(stackBuilders.createDeployment).toBeCalledWith(params, deploymentGenerator.createRStudioDeployment);
      expect(stackBuilders.createService).toBeCalledWith(params, deploymentGenerator.createRStudioService);
      expect(stackBuilders.createIngressRule).toBeCalledWith({ ...params, proxyTimeout, rewriteTarget, pathPattern }, ingressGenerator.createIngress);
      expect(stackBuilders.createConnectIngressRule).toBeCalledWith({ ...params, proxyTimeout, pathPattern }, ingressGenerator.createIngress);
    });
  });

  describe('deleteRStudioStack', () => {
    it('deletes expected resources', async () => {
      // Arrange
      const name = 'name';
      const type = 'rstudio-nb';
      const projectKey = 'projectKey';
      const params = { name, type, projectKey };

      // Act
      await rstudioStack.deleteRStudioStack(params);

      // Assert
      expect(ingressApi.deleteIngress).toHaveBeenNthCalledWith(1, 'rstudio-nb-name-connect', projectKey);
      expect(ingressApi.deleteIngress).toHaveBeenNthCalledWith(2, 'rstudio-nb-name', projectKey);
      expect(serviceApi.deleteService).toBeCalledWith('rstudio-nb-name', projectKey);
      expect(deploymentApi.deleteDeployment).toBeCalledWith('rstudio-nb-name', projectKey);
      expect(configMapApi.deleteNamespacedConfigMap).toBeCalledWith('rstudio-nb-name-rstudio-config', projectKey);
      expect(secretManager.deleteStackCredentialSecret).toBeCalledWith(name, type, projectKey);
    });
  });
});
