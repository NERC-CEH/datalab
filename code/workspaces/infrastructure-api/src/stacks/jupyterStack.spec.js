import jupyterStack from './jupyterStack';
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
secretManager.createNewJupyterCredentials = jest.fn().mockReturnValue(credentials);
secretManager.createStackCredentialSecret = jest.fn().mockResolvedValue();
secretManager.deleteStackCredentialSecret = jest.fn().mockResolvedValue();

jest.mock('./stackBuilders');
stackBuilders.createPySparkConfigMap = jest.fn().mockReturnValue(() => {});
stackBuilders.createDaskConfigMap = jest.fn().mockReturnValue(() => {});
stackBuilders.createJupyterConfigMap = jest.fn().mockReturnValue(() => {});
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

describe('jupyterStack', () => {
  describe('createJupyterNotebook', () => {
    it('creates expected resources', async () => {
      // Arrange
      const name = 'name';
      const type = 'jupyterlab';
      const projectKey = 'projectKey';
      const params = { name, type, projectKey };

      // Act
      await jupyterStack.createJupyterNotebook(params);

      // Assert
      expect(secretManager.createNewJupyterCredentials).toBeCalledWith();
      expect(secretManager.createStackCredentialSecret).toBeCalledWith(name, type, projectKey, credentials);
      expect(stackBuilders.createPySparkConfigMap).toBeCalledWith(params);
      expect(stackBuilders.createDaskConfigMap).toBeCalledWith(params);
      expect(stackBuilders.createJupyterConfigMap).toBeCalledWith(params);
      expect(stackBuilders.createDeployment).toBeCalledWith(params, deploymentGenerator.createJupyterDeployment);
      expect(stackBuilders.createSparkDriverHeadlessService).toBeCalledWith(params);
      expect(stackBuilders.createService).toBeCalledWith(params, deploymentGenerator.createJupyterService);
      expect(stackBuilders.createIngressRule).toBeCalledWith(params, ingressGenerator.createIngress);
    });
  });

  describe('deleteJupyterNotebook', () => {
    it('deletes expected resources', async () => {
      // Arrange
      const name = 'name';
      const type = 'jupyterlab';
      const projectKey = 'projectKey';
      const params = { name, type, projectKey };

      // Act
      await jupyterStack.deleteJupyterNotebook(params);

      // Assert
      expect(ingressApi.deleteIngress).toBeCalledWith('jupyterlab-name', projectKey);
      expect(serviceApi.deleteService).toHaveBeenNthCalledWith(1, 'jupyterlab-name', projectKey);
      expect(serviceApi.deleteService).toHaveBeenNthCalledWith(2, 'jupyterlab-name-spark-driver-headless-service', projectKey);
      expect(deploymentApi.deleteDeployment).toBeCalledWith('jupyterlab-name', projectKey);
      expect(configMapApi.deleteNamespacedConfigMap).toHaveBeenNthCalledWith(1, 'jupyterlab-name-dask-config', projectKey);
      expect(configMapApi.deleteNamespacedConfigMap).toHaveBeenNthCalledWith(2, 'jupyterlab-name-jupyter-config', projectKey);
      expect(configMapApi.deleteNamespacedConfigMap).toHaveBeenNthCalledWith(3, 'jupyterlab-name-pyspark-config', projectKey);
      expect(secretManager.deleteStackCredentialSecret).toBeCalledWith(name, type, projectKey);
    });
  });
});
