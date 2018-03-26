import axios from 'axios/index';
import { get } from 'lodash';
import config from '../config';

const API_URL_BASE = config.get('infrastructureApi');

function getAll({ token }) {
  return axios.get(`${API_URL_BASE}/stacks`, generateOptions(token))
    .then(response => response.data);
}

function getAllByCategory({ token }, category) {
  return axios.get(`${API_URL_BASE}/stacks/category/${category}`, generateOptions(token))
    .then(response => response.data);
}

function getAllByVolumeMount({ token }, volumeMount) {
  return axios.get(`${API_URL_BASE}/stacks/mount/${volumeMount}`, generateOptions(token))
    .then(response => response.data);
}

function getByName({ token }, name) {
  return axios.get(`${API_URL_BASE}/stack/name/${name}`, generateOptions(token))
    .then(response => get(response, 'data.id') || null);
}

function getById({ token }, id) {
  return axios.get(`${API_URL_BASE}/stack/id/${id}`, generateOptions(token))
    .then(response => response.data);
}

function createStack({ token }, stack) {
  return axios.post(`${API_URL_BASE}/stack`, stack, generateOptions(token))
    .then(response => response.data);
}

function deleteStack({ token }, stack) {
  return axios.delete(`${API_URL_BASE}/stack`, generateOptions(token, stack))
    .then(response => response.data);
}

const generateOptions = (token, data) => ({
  headers: {
    authorization: token,
  },
  data,
});

export default { getAll, getAllByCategory, getAllByVolumeMount, getById, getByName, createStack, deleteStack };
