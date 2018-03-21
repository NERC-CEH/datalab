import axios from 'axios/index';
import { get } from 'lodash';
import config from '../config';

const API_URL_BASE = config.get('infrastructureApi');

function getAll({ user, token }) {
  return axios.get(`${API_URL_BASE}/stacks`, { headers: { authorization: token } })
    .then(response => response.data);
}

function getAllByCategory({ user, token }, category) {
  return axios.get(`${API_URL_BASE}/stacks/category/${category}`, { headers: { authorization: token } })
    .then(response => response.data);
}

function getAllByVolumeMount({ user, token }, volumeMount) {
  return axios.get(`${API_URL_BASE}/stacks/mount/${volumeMount}`, { headers: { authorization: token } })
    .then(response => response.data);
}

function getByName({ user, token }, name) {
  return axios.get(`${API_URL_BASE}/stack/name/${name}`, { headers: { authorization: token } })
    .then(response => get(response, 'data.id') || null);
}

function getById({ user, token }, id) {
  return axios.get(`${API_URL_BASE}/stack/id/${id}`, { headers: { authorization: token } })
    .then(response => response.data);
}

function createStack({ user, token }, stack) {
  return axios.post(`${API_URL_BASE}/stack`, stack, { headers: { authorization: token } })
    .then(response => response.data);
}

function deleteStack({ user, token }, stack) {
  return axios.delete(`${API_URL_BASE}/stack`, { data: stack, headers: { authorization: token } })
    .then(response => response.data);
}

export default { getAll, getAllByCategory, getAllByVolumeMount, getById, getByName, createStack, deleteStack };
