import axios from 'axios/index';
import { get } from 'lodash';
import database from '../config/database';
import { getCategoryForType } from '../../shared/stackTypes';
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

// DB access below

function Stack() {
  return database.getModel('Stack');
}

function createOrUpdate(user, requestStack) {
  const query = filterByUser(user, { name: requestStack.name });
  const stack = addOwner(user, { ...requestStack, category: getCategoryForType(requestStack.type) });
  return Stack().findOneAndUpdate(query, stack, { upsert: true, setDefaultsOnInsert: true });
}

function deleteByName(user, name) {
  const query = filterByUser(user, { name });
  return Stack().remove(query).exec();
}

const addOwner = ({ sub }, stack) => ({
  ...stack,
  users: [sub],
});

const filterByUser = ({ sub }, findQuery) => ({
  ...findQuery,
  users: { $elemMatch: { $eq: sub } },
});

export default { getAll, getAllByCategory, getAllByVolumeMount, getById, getByName, createOrUpdate, deleteByName };
