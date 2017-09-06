import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import config from '../config/config';
import proxyRouteApi from './proxyRouteApi';

const mock = new MockAdapter(axios);

const API_BASE = config.get('kongApi');
const SNI_URL = `${API_BASE}/snis`;
const API_URL = `${API_BASE}/apis`;
const KUBERNETES_MASTER_URL = config.get('kubernetesMasterUrl');

const serviceName = 'service';
const datalab = {
  name: 'testlab',
  domain: 'test-datalabs.nerc.ac.uk',
};
const port = 32456;

const certificateId = '035b72e5-0839-40e4-b0fd-751815882279';
const snis = [{
  created_at: 1504605463000,
  name: 'testlab.test-datalabs.nerc.ac.uk',
  ssl_certificate_id: certificateId,
}];
const apiName = 'testlab-service';
const requestedSni = 'testlab-service.test-datalabs.nerc.ac.uk';

describe('Kong Proxy API', () => {
  beforeEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('should create an SNI and route if the do not exist', () => {
    const newSni = createSniPayload();
    const newRoute = createRoutePayload();

    mock.onGet(`${SNI_URL}/${requestedSni}`).reply(404); // SNI not found
    mock.onGet(SNI_URL).reply(200, { data: snis }); // List SNIs
    mock.onPost(SNI_URL, newSni).reply(201); // Create new SNI
    mock.onGet(`${API_URL}/${apiName}`).reply(404); // Route not found
    mock.onPost(API_URL, newRoute).reply(200, { message: 'OK' }); // Successful route creation

    return proxyRouteApi.createOrUpdateRoute(serviceName, datalab, port)
      .then((response) => {
        expect(response.data).toEqual({ message: 'OK' });
      });
  });

  it('should not create an SNI if one exists', () => {
    const newRoute = createRoutePayload();

    mock.onGet(`${SNI_URL}/${requestedSni}`).reply(200, { data: snis[0] }); // SNI exists
    mock.onGet(`${API_URL}/${apiName}`).reply(404);
    mock.onPost(API_URL, newRoute).reply(200, { message: 'OK' });

    return proxyRouteApi.createOrUpdateRoute(serviceName, datalab, port)
      .then((response) => {
        expect(response.data).toEqual({ message: 'OK' });
      });
  });

  it('should not PATCH the route if one exists', () => {
    const newRoute = createRoutePayload();
    const existingRoute = { id: '123' };

    mock.onGet(`${SNI_URL}/${requestedSni}`).reply(200, { data: snis[0] }); // SNI exists
    mock.onGet(`${API_URL}/${apiName}`).reply(200, existingRoute);
    mock.onPatch(`${API_URL}/${existingRoute.id}`, newRoute).reply(200, { message: 'OK' });

    return proxyRouteApi.createOrUpdateRoute(serviceName, datalab, port)
      .then((response) => {
        expect(response.data).toEqual({ message: 'OK' });
      });
  });
});

function createSniPayload() {
  return {
    name: 'testlab-service.test-datalabs.nerc.ac.uk',
    ssl_certificate_id: certificateId,
  };
}

function createRoutePayload() {
  return {
    name: apiName,
    hosts: requestedSni,
    upstream_url: `${KUBERNETES_MASTER_URL}:${port}`,
    preserve_host: true,
    https_only: true,
  };
}
