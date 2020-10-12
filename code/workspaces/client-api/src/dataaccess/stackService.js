import axios from 'axios/index';
import { get } from 'lodash';
import config from '../config';

const API_URL_BASE = config.get('infrastructureApi');

function getAll(projectKey, { token }) {
  return axios.get(`${API_URL_BASE}/stacks/${projectKey}`, generateOptions(token))
    .then(response => response.data);
}

function getAllByCategory(projectKey, category, { token }) {
  return axios.get(`${API_URL_BASE}/stacks/${projectKey}/category/${category}`, generateOptions(token))
    .then(response => response.data);
}

function getAllByVolumeMount(projectKey, volumeMount, { token }) {
  return axios.get(`${API_URL_BASE}/stacks/${projectKey}/mount/${volumeMount}`, generateOptions(token))
    .then(response => response.data);
}

function getByName(projectKey, name, { token }) {
  return axios.get(`${API_URL_BASE}/stack/${projectKey}/name/${name}`, generateOptions(token))
    .then(response => get(response, 'data.id') || null);
}

function getById(projectKey, id, { token }) {
  return axios.get(`${API_URL_BASE}/stack/${projectKey}/id/${id}`, generateOptions(token))
    .then(response => response.data);
}

function createStack(projectKey, stack, { token }) {
  return axios.post(`${API_URL_BASE}/stack/${projectKey}`, stack, generateOptions(token))
    .then(response => response.data);
}

function deleteStack(projectKey, stack, { token }) {
  return axios.delete(`${API_URL_BASE}/stack/${projectKey}`, generateOptions(token, stack))
    .then(response => response.data);
}

function updateStack(projectKey, stack, { token }) {
  return axios.put(`${API_URL_BASE}/stack/${projectKey}`, stack, generateOptions(token))
    .then(response => response.data);
}

function restartStack(projectKey, stack, { token }) {
  return axios.put(`${API_URL_BASE}/stack/${projectKey}/restart`, stack, generateOptions(token))
    .then(response => response.data);
}

const generateOptions = (token, data) => ({
  headers: {
    authorization: token,
  },
  data,
});

export default { getAll, getAllByCategory, getAllByVolumeMount, getById, getByName, createStack, deleteStack, updateStack, restartStack };
