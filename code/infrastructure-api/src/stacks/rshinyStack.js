import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import { createDeployment, createService, createIngressRule } from './stackBuilders';

function createRShinyStack(params) {
  const { datalabInfo, name, type } = params;

  return createDeployment(params, deploymentGenerator.createRShinyDeployment)()
    .then(createService(name, type, deploymentGenerator.createRShinyService))
    .then(createIngressRule(name, type, datalabInfo, ingressGenerator.createIngress));
}

function deleteRShinyStack(params) {
  const { datalabInfo, name, type } = params;
  const k8sName = `${type}-${name}`;

  return ingressApi.deleteIngress(name, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName));
}

export default { createRShinyStack, deleteRShinyStack };
