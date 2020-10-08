import config from '../config/config';
import { VolumeTemplates, generateManifest } from './manifestGenerator';

function getStorageClass(type) {
  // these values correspond to code/workspaces/client-api/src/schema/resolvers.js StorageType
  if (type === '1') {
    return config.get('glusterFSStorageClass');
  } if (type === '2') {
    return config.get('nfsStorageClass');
  }
  throw new Error(`Unrecognized storage class type ${type}`);
}

async function createVolume(name, volumeSize, type) {
  const storageClass = await getStorageClass(type);
  const context = {
    name,
    volumeSize,
    storageClass,
  };
  return generateManifest(context, VolumeTemplates.DEFAULT_VOLUME);
}

export default { createVolume };
