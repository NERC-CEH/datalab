import { stackTypes } from 'common';
import { createRStudioConfigMap, ingressPath, ingressConnectPath, createIngressRule, createConnectIngressRule, createIngressRuleWithConnect } from './stackBuilders';
import ingressGenerator from '../kubernetes/ingressGenerator';
import configMapApi from '../kubernetes/configMapApi';
import ingressApi from '../kubernetes/ingressApi';
import config from '../config/config';

jest.mock('../config/config');
const origConfig = jest.requireActual('../config/config');
config.get = jest.fn().mockImplementation(s => origConfig.default.default(s));

jest.mock('../kubernetes/configMapApi');
configMapApi.createOrReplaceNamespacedConfigMap = jest.fn().mockReturnValue('configmap return');

jest.mock('../kubernetes/ingressApi');
ingressApi.createOrUpdateIngress = jest.fn().mockReturnValue();

const name = 'name';
const projectKey = 'projectKey';
const rewriteTarget = '/$2';
const pathPattern = '(/|$)(.*)';
const service = {
  metadata: { name: 'service-name' },
  spec: { ports: [
    { port: 80 },
    { port: 8000 },
  ] },
};

beforeEach(() => jest.clearAllMocks());

describe('stackBuilders', () => {
  describe('createRStudioConfigMap', () => {
    it('makes expected call to api', async () => {
      const val = await createRStudioConfigMap({ name, projectKey, type: stackTypes.RSTUDIO })();
      expect(val).toEqual('configmap return');
      expect(configMapApi.createOrReplaceNamespacedConfigMap).toBeCalledWith('rstudio-name-proxy-headers-config', 'projectKey', `---
apiVersion: v1
kind: ConfigMap
metadata:
  name: rstudio-name-proxy-headers-config
data:
  X-RStudio-Root-Path /resource/projectKey/name
`);
    });
  });

  describe('ingressPath', () => {
    it('gives expected ingress paths', () => {
      expect(ingressPath('assumed-not-single-host', projectKey, name)).toEqual('/');
      expect(ingressPath(stackTypes.JUPYTER, projectKey, name)).toEqual('/resource/projectKey/name');
      expect(ingressPath(stackTypes.JUPYTER, projectKey, name, pathPattern)).toEqual('/resource/projectKey/name(/|$)(.*)');
    });
  });

  describe('ingressConnectPath', () => {
    it('gives expected ingress paths', () => {
      expect(ingressConnectPath('assumed-not-single-host', projectKey, name)).toEqual('/connect');
      expect(ingressConnectPath(stackTypes.JUPYTER, projectKey, name)).toEqual('/resource/projectKey/name/connect');
      expect(ingressConnectPath(stackTypes.JUPYTER, projectKey, name, pathPattern)).toEqual('/resource/projectKey/name/connect(/|$)(.*)');
    });
  });

  describe('createIngressRule', () => {
    it('makes expected call to api', async () => {
      const val = await createIngressRule({ name, projectKey, type: stackTypes.RSTUDIO, rewriteTarget, pathPattern }, ingressGenerator.createIngress)(service);
      expect(val).toEqual(service);
      expect(ingressApi.createOrUpdateIngress).toBeCalledWith('rstudio-name', 'projectKey', `---
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: rstudio-name
  annotations:
    nginx.ingress.kubernetes.io/auth-url: http://localhost:9000/auth
    nginx.ingress.kubernetes.io/auth-signin: https://testlab.test-datalabs.nerc.ac.uk
    nginx.ingress.kubernetes.io/proxy-body-size: 50g
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  tls:
  - hosts:
    - testlab.datalabs.localhost
  rules:
  - host: testlab.datalabs.localhost
    http:
      paths:
      - path: /resource/projectKey/name(/|$)(.*)
        backend:
          serviceName: service-name
          servicePort: 80
`);
    });
  });

  describe('createConnectIngressRule', () => {
    it('makes expected call to api', async () => {
      const val = await createConnectIngressRule({ name, projectKey, type: stackTypes.RSTUDIO, pathPattern }, ingressGenerator.createIngress)(service);
      expect(val).toEqual(service);
      expect(ingressApi.createOrUpdateIngress).toBeCalledWith('rstudio-name-connect', 'projectKey', `---
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: rstudio-name-connect
  annotations:
    nginx.ingress.kubernetes.io/auth-url: http://localhost:9000/auth
    nginx.ingress.kubernetes.io/auth-signin: https://testlab.test-datalabs.nerc.ac.uk
    nginx.ingress.kubernetes.io/proxy-body-size: 50g
spec:
  tls:
  - hosts:
    - testlab.datalabs.localhost
  rules:
  - host: testlab.datalabs.localhost
    http:
      paths:
      - path: /resource/projectKey/name/connect(/|$)(.*)
        backend:
          serviceName: service-name
          servicePort: 8000
`);
    });
  });

  describe('createIngressRuleWithConnect', () => {
    it('makes expected call to api', async () => {
      const val = await createIngressRuleWithConnect({ name, projectKey, type: 'minio', rewriteTarget: '/' }, ingressGenerator.createIngress)(service);
      expect(val).toEqual(service);
      expect(ingressApi.createOrUpdateIngress).toBeCalledWith('minio-name', 'projectKey', `---
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: minio-name
  annotations:
    nginx.ingress.kubernetes.io/auth-url: http://localhost:9000/auth
    nginx.ingress.kubernetes.io/auth-signin: https://testlab.test-datalabs.nerc.ac.uk
    nginx.ingress.kubernetes.io/proxy-body-size: 50g
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  tls:
  - hosts:
    - projectKey-name.datalabs.localhost
  rules:
  - host: projectKey-name.datalabs.localhost
    http:
      paths:
      - path: /
        backend:
          serviceName: service-name
          servicePort: 80
      - path: /connect
        backend:
          serviceName: service-name
          servicePort: 8000
`);
    });
  });
});
