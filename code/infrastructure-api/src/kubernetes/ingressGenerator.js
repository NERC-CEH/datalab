import config from '../config/config';
import { IngressTemplates, generateManifest } from './manifestGenerator';

function createIngress({ name, datalabInfo, ingressName, serviceName, port, connectPort }) {
  const host = createSniInfo(name, datalabInfo);
  const paths = createPathInfo(serviceName, port, connectPort);
  const context = {
    name: ingressName,
    authServiceUrl: config.get('authServiceUrl'),
    authSigninUrl: config.get('authSigninUrl'),
    service: { host, paths },
  };

  return generateManifest(context, IngressTemplates.DEFAULT_INGRESS);
}

function createSniInfo(name, datalab) {
  return `${datalab.name}-${name}.${datalab.domain}`;
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
