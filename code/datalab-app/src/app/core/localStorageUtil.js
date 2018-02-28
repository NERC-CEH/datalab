import { isObject } from 'lodash';

const knownFields = [
  'access_token', // Authentication - JWT access token
  'expires_at', // Authentication - JWT access token expiration time
  'id_token', // Authentication - JWT id token
  'identity', // Identification - Collected ID token payload
];

export function addToLocalStorage(fieldName, value) {
  const stringifyValue = isObject(value) ? JSON.stringify(value) : value;

  if (knownFields.includes(fieldName)) {
    localStorage.setItem(fieldName, stringifyValue);
  } else {
    throw new Error(`Unknown localStorage field name: ${fieldName}.`);
  }
}

export function removeFromLocalStorage(fieldName) {
  if (knownFields.includes(fieldName)) {
    localStorage.removeItem(fieldName);
  } else {
    throw new Error(`Unknown localStorage field name: ${fieldName}.`);
  }
}

export function getFromLocalStorage(fieldName) {
  if (knownFields.includes(fieldName)) {
    return localStorage.getItem(fieldName);
  }
  throw new Error(`Unknown localStorage field name: ${fieldName}.`);
}
