const knownFields = [
  'access_token', // Authentication - JWT access token
  'expires_at', // Authentication - JWT access token expiration time
  'id_token', // Authentication - JWT id token
  'identity', // Identification - Collected ID token payload
];

export function addToLocalStorage(fieldName, value) {
  if (knownFields.includes(fieldName)) {
    localStorage.setItem(fieldName, value);
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
