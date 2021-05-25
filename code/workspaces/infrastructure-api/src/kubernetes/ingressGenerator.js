import { isSingleHostName } from 'common/src/stackTypes';
import config from '../config/config';
import { IngressTemplates, generateManifest } from './manifestGenerator';

function createIngress({ name, projectKey, ingressName, serviceName, port,
  connectPort, path, connectPath, rewriteTarget, proxyTimeout, visible, proxyRequestBuffering, type, proxyHeadersConfigMap }) {
  const host = createSniInfo(name, projectKey, type);
  const paths = createPathInfo(serviceName, port, connectPort, path, connectPath);
  const privateEndpoint = visible !== 'public';
  const authServiceUrlRoot = config.get('authorisationServiceForIngress') || config.get('authorisationService');
  const context = {
    name: ingressName,
    authServiceUrl: `${authServiceUrlRoot}/auth`,
    authSigninUrl: config.get('authSigninUrl'),
    maxBodySize: config.get('maxBodySize'),
    proxyRequestBuffering,
    rewriteTarget,
    proxyTimeout,
    service: { host, paths },
    privateEndpoint,
    proxyHeadersConfigMap,
  };

  return generateManifest(context, IngressTemplates.DEFAULT_INGRESS);
}

function createSniInfo(name, projectKey, type) {
  const domain = config.get('datalabDomain');
  const lab = config.get('datalabName');
  return isSingleHostName(type)
    ? `${lab}.${domain}`
    : `${projectKey}-${name}.${domain}`;
}

function createPathInfo(serviceName, port, connectPort, path, connectPath) {
  const paths = [];
  paths.push({
    path,
    serviceName,
    servicePort: port,
  });

  if (connectPort) {
    paths.push({
      path: connectPath,
      serviceName,
      servicePort: connectPort,
    });
  }

  return paths;
}

export default { createIngress };
