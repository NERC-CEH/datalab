import crypto from 'crypto';
import { v4 as uuid } from 'uuid';

const DEFAULT_LENGTH = 20;

function generateUUID() {
  return uuid();
}

function generateRandomString() {
  return crypto.randomBytes(DEFAULT_LENGTH / 2).toString('hex');
}

export default { generateUUID, generateRandomString };
