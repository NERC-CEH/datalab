import { stackTypes } from 'common';
import { NOTEBOOK_CATEGORY, SITE_CATEGORY } from 'common/src/config/images';
import config from '../config/config';
import secretManager from '../credentials/secretManager';
import { createKubectlJob } from '../kubernetes/jobGenerator';
import jobApi from '../kubernetes/jobApi';
import ingressApi from '../kubernetes/ingressApi';
import deploymentApi from '../kubernetes/deploymentApi';
import nameGenerators from '../common/nameGenerators';
import { visibility } from '../models/stackEnums';
import zeppelin from './zeppelinStack';

const { deploymentName } = nameGenerators;
const { JUPYTER, JUPYTERLAB, ZEPPELIN } = stackTypes;

const mountPath = '/mnt/persistentfs';

const getJupyterCookiePath = jupyterDirectory => `${jupyterDirectory}/runtime/jupyter_cookie_secret`;

const jupyterDirectoryEnvName = 'JUPYTER_DATA_DIR';

// Find the location of the .jupyter directory based on the environment variables in the deployment.
const getJupyterDirectory = (deployment, deploymentData) => {
  const { containers } = deploymentData.spec.template.spec;
  const defaultDirectory = `${mountPath}/notebooks/${deployment}/.jupyter`;

  const container = containers.find(c => c.name === deployment);
  if (!container) {
    return defaultDirectory;
  }

  const { env } = container;

  const envVar = env.find(e => e.name === jupyterDirectoryEnvName);
  if (!envVar || !envVar.value) {
    return defaultDirectory;
  }

  return envVar.value.replace('/data', mountPath);
};

const getIngressPatch = authValue => ({
  metadata: {
    annotations: {
      'nginx.ingress.kubernetes.io/auth-url': authValue,
    },
  },
});

export const makeJupyterPrivate = async (name, type, projectKey, volumeMount) => {
  // Changing a Jupyter notebook to private requires a token refresh, and to remove a file from the notebook's storage.
  const credentials = secretManager.createNewJupyterCredentials();
  await secretManager.createStackCredentialSecret(name, type, projectKey, credentials);

  const deployment = deploymentName(name, type);

  const deploymentData = await deploymentApi.getDeployment(deployment, projectKey);
  const jupyterDirectory = getJupyterDirectory(deployment, deploymentData);

  // Trigger a job to remove a cookie file from the volume and restart the notebook pod
  const runCommand = `rm -f ${getJupyterCookiePath(jupyterDirectory)}`;
  const kubectlCommand = `kubectl rollout restart deployment/${deployment}`;

  const manifest = await createKubectlJob({ name, runCommand, kubectlCommand, volumeMount, mountPath });
  await jobApi.createJob(name, projectKey, manifest);
};

export const makeZeppelinPrivate = async (name, type, projectKey) => {
  const credentials = secretManager.createNewUserCredentials();

  const shiroIni = await zeppelin.generateNewShiroIni(credentials);
  await secretManager.createStackCredentialSecret(name, type, projectKey, { ...shiroIni, ...credentials });

  const deployment = deploymentName(name, type);
  await deploymentApi.restartDeployment(deployment, projectKey);
};

export const handleSharedChange = async (params, existing, newSharedStatus) => {
  const { category, shared, type, volumeMount, visible } = existing;

  const oldSharedStatus = shared || visible;

  if (oldSharedStatus === visibility.PRIVATE || oldSharedStatus === newSharedStatus) {
    // Going from private to another status (or staying at the same status) requires no extra changes.
    return;
  }

  const { projectKey, name } = params;

  if (category === SITE_CATEGORY) {
    const ingressName = deploymentName(name, type);
    if (newSharedStatus === visibility.PUBLIC) {
      // When making a site public, remove an ingress annotation
      await ingressApi.patchIngress(ingressName, projectKey, getIngressPatch(null));
    }

    if (oldSharedStatus === visibility.PUBLIC) {
      // When making a site non-public, add an ingress annotation
      const authServiceUrlRoot = config.get('authorisationServiceForIngress') || config.get('authorisationService');
      await ingressApi.patchIngress(ingressName, projectKey, getIngressPatch(`${authServiceUrlRoot}/auth`));
    }

    // No backend changes needed for other status changes
    return;
  }

  if (category === NOTEBOOK_CATEGORY && newSharedStatus === visibility.PRIVATE) {
    if (type === JUPYTER || type === JUPYTERLAB) {
      await makeJupyterPrivate(name, type, projectKey, volumeMount);
    }

    if (type === ZEPPELIN) {
      await makeZeppelinPrivate(name, type, projectKey);
    }

    // Nothing to do for RStudio, we just have to let the token expire.
  }
};

export default {
  handleSharedChange,
};

