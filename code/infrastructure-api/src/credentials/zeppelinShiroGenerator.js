import crypto from 'crypto';

const RANDOM_STRING_LENGTH = 64;
const ITERATIONS = 500000;
const ALGORITHM = 'sha256';
const BYTE_TO_STRING_ENCODING = 'hex';

function generateNewShiroCredentials(password, salt) {
  const passwordToHash = password || generateRandomString();
  const saltForHash = salt || generateRandomString();

  return generateShiroCredentials(passwordToHash, saltForHash);
}

function generateShiroCredentials(password, salt) {
  const hashPasswordDigest = generateHash(password, salt);
  return {
    password,
    salt,
    shiroCredentials: createShiroCredentialsString(salt, hashPasswordDigest),
  };
}

function generateRandomString() {
  return crypto.randomBytes(RANDOM_STRING_LENGTH).toString('hex');
}

function generateHash(password, salt) {
  try {
    let hashVal = calculateDigest(salt + password);
    for (let i = 1; i < ITERATIONS; i += 1) {
      hashVal = calculateDigest(Buffer.from(hashVal, 'hex'));
    }

    return hashVal;
  } catch (e) {
    throw new Error('Invalid message digest algorithm');
  }
}

function calculateDigest(valueToHash) {
  return crypto.createHash(ALGORITHM).update(valueToHash).digest(BYTE_TO_STRING_ENCODING);
}

function createShiroCredentialsString(salt, hexPasswordDigest) {
  const base64Salt = Buffer.from(salt).toString('base64');
  const base64PasswordDigest = Buffer.from(hexPasswordDigest, 'hex').toString('base64');
  return `$shiro1$SHA-256$${ITERATIONS}$${base64Salt}$${base64PasswordDigest}`;
}

export default { generateNewShiroCredentials, generateHash };
