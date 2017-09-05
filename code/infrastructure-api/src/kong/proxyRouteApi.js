import axios from 'axios';
import config from '../config/config';

const API_BASE = config.get('kongApi');
const SNI_URL = `${API_BASE}/snis`;
const API_URL = `${API_BASE}/apis`;
const KUBERNETES_MASTER_URL = config.get('kubernetesMasterUrl');

/**
 * This module idempotently creates a Kong proxy route
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
function createOrUpdateRoute(name, datalab, k8sPort) {
  const apiName = `${datalab.name}-${name}`;
  const requestedSni = `${datalab.name}-${name}.${datalab.domain}`;
  const baseSni = `${datalab.name}.${datalab.domain}`;

  return getSni(requestedSni)
    .then(createSniIfRequired(requestedSni, baseSni))
    .then(() => getApi(apiName))
    .then(createOrUpdateApi(apiName, requestedSni, k8sPort));
}

function getSni(sni) {
  return axios.get(`${SNI_URL}/${sni}`)
    .then(response => response.data.data)
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

const createOrUpdateApi = (apiName, requestedSni, k8sPort) => (existingApi) => {
  const payload = createPayload(apiName, requestedSni, k8sPort);

  if (existingApi) {
    return axios.patch(`${API_URL}/${existingApi.id}`, payload);
  }

  return axios.post(API_URL, payload);
};

function createPayload(apiName, requestedSni, k8sPort) {
  return {
    name: apiName,
    hosts: requestedSni,
    upstream_url: `${KUBERNETES_MASTER_URL}:${k8sPort}`,
    preserve_host: true,
    https_only: true,
  };
}

export default { createOrUpdateRoute };
