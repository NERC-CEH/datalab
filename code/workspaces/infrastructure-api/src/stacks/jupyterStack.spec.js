import jupyterStack from './jupyterStack';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import ingressGenerator from '../kubernetes/ingressGenerator';
import secretManager from '../credentials/secretManager';
import * as stackBuilders from './stackBuilders';

jest.mock('../credentials/secretManager');
const credentials = { token: 'a-token' };
secretManager.createNewJupyterCredentials = jest.fn().mockReturnValue(credentials);
secretManager.createStackCredentialSecret = jest.fn().mockResolvedValue();

jest.mock('./stackBuilders');
stackBuilders.createPySparkConfigMap = jest.fn().mockReturnValue(() => {});
stackBuilders.createDaskConfigMap = jest.fn().mockReturnValue(() => {});
stackBuilders.createJupyterConfigMap = jest.fn().mockReturnValue(() => {});
stackBuilders.createDeployment = jest.fn().mockReturnValue(() => {});
stackBuilders.createSparkDriverHeadlessService = jest.fn().mockReturnValue(() => {});
stackBuilders.createService = jest.fn().mockReturnValue(() => {});
stackBuilders.createIngressRule = jest.fn().mockReturnValue(() => {});

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
});
