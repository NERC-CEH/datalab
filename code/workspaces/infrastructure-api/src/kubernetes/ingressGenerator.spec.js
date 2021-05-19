import { JUPYTER } from 'common/src/stackTypes';
import ingressGenerator from './ingressGenerator';
import config from '../config/config';

jest.mock('../config/config');
const origConfig = jest.requireActual('../config/config');
config.get = jest.fn().mockImplementation(s => origConfig.default.default(s));

describe('Ingress generator', () => {
  it('should generate a single path if connect port is not supplied', () => {
    const options = {
      name: 'name',
      projectKey: 'project',
      ingressName: 'name-ingress',
      serviceName: 'name-service',
      port: 80,
      path: '/',
    };
    const template = ingressGenerator.createIngress(options);

    return expect(template).resolves.toMatchSnapshot();
  });

  it('should generate multiple paths if connect port is supplied', () => {
    const options = {
      name: 'name',
      projectKey: 'project',
      ingressName: 'name-ingress',
      serviceName: 'name-service',
      port: 80,
      connectPort: 8000,
      path: '/',
      connectPath: '/connect',
    };
    const template = ingressGenerator.createIngress(options);

    return expect(template).resolves.toMatchSnapshot();
  });

  it('should add rewrite target if supplied', () => {
    const options = {
      name: 'name',
      projectKey: 'project',
      ingressName: 'name-ingress',
      serviceName: 'name-service',
      port: 80,
      connectPort: 8000,
      path: '/',
      connectPath: '/connect',
      rewriteTarget: '/here',
    };
    const template = ingressGenerator.createIngress(options);

    return expect(template).resolves.toMatchSnapshot();
  });

  it('should add proxy-timeout options if supplied', () => {
    const options = {
      name: 'name',
      projectKey: 'project',
      ingressName: 'name-ingress',
      serviceName: 'name-service',
      port: 80,
      connectPort: 8000,
      path: '/',
      connectPath: '/connect',
      proxyTimeout: '1800',
    };
    const template = ingressGenerator.createIngress(options);

    return expect(template).resolves.toMatchSnapshot();
  });

  it('should add auth-url for privateEndpoints', () => {
    const options = {
      name: 'name',
      projectKey: 'project',
      ingressName: 'name-ingress',
      serviceName: 'name-service',
      port: 80,
      path: '/',
      visible: 'private',
    };
    const template = ingressGenerator.createIngress(options);

    return expect(template).resolves.toMatchSnapshot();
  });

  it('should not add auth-url for a non-private endpoints', () => {
    const options = {
      name: 'name',
      projectKey: 'project',
      ingressName: 'name-ingress',
      serviceName: 'name-service',
      port: 80,
      path: '/',
      visible: 'public',
    };
    const template = ingressGenerator.createIngress(options);

    return expect(template).resolves.toMatchSnapshot();
  });

  it('should add proxy-request-buffering option if supplied', () => {
    const options = {
      name: 'name',
      projectKey: 'project',
      ingressName: 'name-ingress',
      serviceName: 'name-service',
      port: 80,
      path: '/',
      proxyRequestBuffering: 'off',
    };
    const template = ingressGenerator.createIngress(options);

    return expect(template).resolves.toMatchSnapshot();
  });

  it('should add proxy-set-headers option if supplied', () => {
    const options = {
      name: 'name',
      projectKey: 'project',
      ingressName: 'name-ingress',
      serviceName: 'name-service',
      port: 80,
      path: '/',
      proxyHeadersConfigMap: 'proxy-headers-config-map',
    };
    const template = ingressGenerator.createIngress(options);

    return expect(template).resolves.toMatchSnapshot();
  });

  it('should use datalab hostname and custom path for single hostname type', () => {
    const options = {
      name: 'name',
      projectKey: 'project',
      ingressName: 'name-ingress',
      serviceName: 'name-service',
      port: 80,
      path: '/resource/project/name',
      type: JUPYTER,
    };
    const template = ingressGenerator.createIngress(options);

    return expect(template).resolves.toMatchSnapshot();
  });
});
