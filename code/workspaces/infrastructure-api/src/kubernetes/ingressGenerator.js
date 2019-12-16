import config from '../config/config';
import { IngressTemplates, generateManifest } from './manifestGenerator';

function createIngress({ name, projectKey, ingressName, serviceName, port, connectPort, rewriteTarget, proxyTimeout, visible }) {
  const host = createSniInfo(name, projectKey);
  const paths = createPathInfo(serviceName, port, connectPort);
  const privateEndpoint = visible !== 'public';
  const context = {
    name: ingressName,
    authServiceUrl: `${config.get('authorisationService')}/auth`,
    authSigninUrl: config.get('authSigninUrl'),
    maxBodySize: config.get('maxBodySize'),
    rewriteTarget,
    proxyTimeout,
    service: { host, paths },
    privateEndpoint,
  };

  return generateManifest(context, IngressTemplates.DEFAULT_INGRESS);
}

function createSniInfo(name, projectKey) {
  return `${projectKey}-${name}.${config.get('datalabDomain')}`;
}

function createPathInfo(serviceName, port, connectPort) {
  const paths = [];
  paths.push({
    path: '/',
    serviceName,
    servicePort: port,
  });

  if (connectPort) {
    paths.push({
      path: '/connect',
      serviceName,
      servicePort: connectPort,
    });
  }

  return paths;
}

export default { createIngress };
