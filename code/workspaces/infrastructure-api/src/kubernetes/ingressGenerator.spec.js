import ingressGenerator from './ingressGenerator';

describe('Ingress generator', () => {
  it('should generate a single path if connect port is not supplied', () => {
    const options = {
      name: 'name',
      projectKey: 'project',
      ingressName: 'name-ingress',
      serviceName: 'name-service',
      port: 80,
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
      privateEndpoint: true,
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
      privateEndpoint: false,
    };
    const template = ingressGenerator.createIngress(options);

    return expect(template).resolves.toMatchSnapshot();
  });
});
