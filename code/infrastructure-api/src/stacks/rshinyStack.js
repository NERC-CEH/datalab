import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import proxyRouteApi from '../kong/proxyRouteApi';
import { createDeployment, createService, createProxyRoute } from './stackBuilders';

function createRShinyStack(params) {
  const { datalabInfo, name, type } = params;
  return createDeployment(params, deploymentGenerator.createRShinyDeployment)()
    .then(createService(name, type, deploymentGenerator.createRShinyService))
    .then(createProxyRoute(name, datalabInfo));
}

function deleteRShinyStack({ datalabInfo, name, type }) {
  const k8sName = `${type}-${name}`;
  return proxyRouteApi.deleteRoute(name, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName));
}

export default { createRShinyStack, deleteRShinyStack };
