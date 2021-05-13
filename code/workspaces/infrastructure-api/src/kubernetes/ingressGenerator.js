import { isSingleHostName, basePath } from 'common/src/stackTypes';
import { join } from 'path';
import config from '../config/config';
import { IngressTemplates, generateManifest } from './manifestGenerator';

function createIngress({ name, projectKey, ingressName, serviceName, port,
  connectPort, rewriteTarget, proxyTimeout, visible, proxyRequestBuffering, type }) {
  const host = createSniInfo(name, projectKey, type);
  const paths = createPathInfo(serviceName, port, connectPort, type, projectKey, name);
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

function createPathInfo(serviceName, port, connectPort, type, projectKey, name) {
  const paths = [];
  const base = basePath(type, projectKey, name);
  paths.push({
    path: base,
    serviceName,
    servicePort: port,
  });

  if (connectPort) {
    paths.push({
      path: join(base, 'connect'),
      serviceName,
      servicePort: connectPort,
    });
  }

  return paths;
}

export default { createIngress };
