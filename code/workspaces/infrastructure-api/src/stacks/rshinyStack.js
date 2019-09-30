import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import { createDeployment, createService, createIngressRule } from './stackBuilders';

function createRShinyStack(params) {
  return createDeployment(params, deploymentGenerator.createRShinyDeployment)()
    .then(createService(params, deploymentGenerator.createRShinyService))
    .then(createIngressRule(params, ingressGenerator.createIngress));
}

function deleteRShinyStack(params) {
  const { name, type, projectKey } = params;
  const k8sName = `${type}-${name}`;

  return ingressApi.deleteIngress(k8sName, projectKey)
    .then(() => serviceApi.deleteService(k8sName, projectKey))
    .then(() => deploymentApi.deleteDeployment(k8sName, projectKey));
}

export default { createRShinyStack, deleteRShinyStack };
