import axios from 'axios';
import logger from 'winston';
import { has, get } from 'lodash';
import config from '../config/config';

const API_BASE = config.get('kongApi');
const SNI_URL = `${API_BASE}/snis`;
const API_URL = `${API_BASE}/apis`;
const KUBERNETES_MASTER_URL = config.get('kubernetesMasterUrl');

/**
 * This function deletes a Kong proxy route and matching SNI.
 * It performs no checks before issuing the delete as the Kong API returns a 404
 * if the route is not found. This is logged and the function returns success.
 * Any other errors are logged with a failure response.
 */
function deleteRoute(name, datalab) {
  const routeInfo = createRouteInfo(name, datalab);
  return deleteApi(routeInfo.apiName)
    .then(() => deleteSni(routeInfo.requestedSni));
}

/**
 * This function deletes a Kong proxy route, connect route and matching SNI.
 * It performs no checks before issuing the delete as the Kong API returns a 404
 * if the route is not found. This is logged and the function returns success.
 * Any other errors are logged with a failure response.
 */
function deleteRouteWithConnect(name, datalab) {
  const routeInfo = createRouteInfo(name, datalab);
  const connectRouteInfo = createRouteInfo(name, datalab, true);
  return deleteApi(routeInfo.apiName)
    .then(() => deleteApi(connectRouteInfo.apiName))
    .then(() => deleteSni(routeInfo.requestedSni));
}

/**
 * This function idempotently creates a Kong proxy route
 * To do this it performs the following steps
 * - Get the existing SNI if it exists
 * - Create a new SNI if one does not exist
 * - Get the existing route if one exists
 * - Create or replace the existing route as required
 *
 * @param name the name of the service
 * @param datalab information about the datalab hosting the service
 * @param k8sPort the kubernetes port the service is located at
 */
function createOrUpdateRoute(name, datalab, k8sPort, connectRoute = false) {
  const routeInfo = createRouteInfo(name, datalab, connectRoute);

  return getSni(routeInfo.requestedSni)
    .then(createSniIfRequired(routeInfo.requestedSni, routeInfo.baseSni))
    .then(() => getApi(routeInfo.apiName))
    .then(createOrUpdateApi(routeInfo.apiName, routeInfo.requestedSni, k8sPort, connectRoute));
}

function createRouteInfo(name, datalab, connectRoute) {
  let apiName = `${datalab.name}-${name}`;
  if (connectRoute) {
    apiName = `${apiName}-connect`;
  }

  return {
    apiName,
    requestedSni: `${datalab.name}-${name}.${datalab.domain}`,
    baseSni: `${datalab.name}.${datalab.domain}`,
  };
}

function getSni(sni) {
  return axios.get(`${SNI_URL}/${sni}`)
    .then(response => response.data)
    .catch(() => undefined);
}

const createSniIfRequired = (requestedSni, baseSni) => (sni) => {
  if (!sni) {
    return getCertificateId(baseSni)
      .then(createSni(requestedSni));
  }
  return undefined;
};

function getCertificateId(datalabDomain) {
  return axios.get(SNI_URL)
    .then(response => response.data.data)
    .then(filterSnis(datalabDomain))
    .then(sni => sni.ssl_certificate_id);
}

const filterSnis = datalabDomain => (snis) => {
  const filteredSnis = snis.filter(sni => sni.name === datalabDomain);
  if (filteredSnis.length === 0) {
    throw new Error(`Unable to identify the ssl_certificate_id for domain: ${datalabDomain}`);
  }
  return filteredSnis[0];
};

const createSni = sni => (certificateId) => {
  logger.info(`Creating SNI: ${sni}`);
  const payload = {
    name: sni,
    ssl_certificate_id: certificateId,
  };

  return axios.post(SNI_URL, payload);
};

function getApi(apiName) {
  return axios.get(`${API_URL}/${apiName}`)
    .then(response => response.data)
    .catch(() => undefined);
}

const createOrUpdateApi = (apiName, requestedSni, k8sPort, connectRoute) => (existingApi) => {
  const payload = createPayload(apiName, requestedSni, k8sPort, connectRoute);

  if (existingApi) {
    logger.info(`Updating route: ${apiName}`);
    return axios.patch(`${API_URL}/${existingApi.id}`, payload);
  }

  logger.info(`Creating route: ${apiName}`);
  return axios.post(API_URL, payload);
};

function deleteSni(sniName) {
  logger.info(`Deleting SNI: ${sniName}`);
  return axios.delete(`${SNI_URL}/${sniName}`)
    .then(response => response.data)
    .catch(handleDeleteError('SNI', sniName));
}

function deleteApi(apiName) {
  logger.info(`Deleting API: ${apiName}`);
  return axios.delete(`${API_URL}/${apiName}`)
    .then(response => response.data)
    .catch(handleDeleteError('API', apiName));
}

const handleDeleteError = (type, name) => (error) => {
  if (has(error, 'response.status') && get(error, 'response.status') === 404) {
    logger.warn(`Could not find ${type}: ${name} to delete it`);
    return Promise.resolve();
  }

  logger.error(`Error deleting ${type}: ${name}`);
  throw new Error(`Kong API error: ${error.message}`);
};

function createPayload(apiName, requestedSni, k8sPort, connectRoute) {
  const basePayload = {
    name: apiName,
    hosts: requestedSni,
    upstream_url: `${KUBERNETES_MASTER_URL}:${k8sPort}`,
    preserve_host: true,
    https_only: true,
  };

  if (connectRoute) {
    return {
      ...basePayload,
      strip_uri: true,
      uris: '/connect',
    };
  }

  return basePayload;
}

export default { createOrUpdateRoute, deleteRoute, deleteRouteWithConnect };
