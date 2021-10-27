import { CrossStorageClient } from 'cross-storage';

const MINIO_TOKEN_KEY = 'token';

function openStorage(storageUrl, token) {
  const storageHost = new URL(storageUrl).origin;
  const storage = new CrossStorageClient(`${storageHost}/connect`);

  return storage.onConnect()
    .then(() => storage.set(MINIO_TOKEN_KEY, token))
    .then(() => window.open(storageUrl));
}

const minioService = { openStorage };
export default minioService;
