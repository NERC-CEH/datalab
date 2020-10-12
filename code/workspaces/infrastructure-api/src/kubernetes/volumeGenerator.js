import config from '../config/config';
import { VolumeTemplates, generateManifest } from './manifestGenerator';
import { NFS, GLUSTERFS } from '../models/dataStorage.model';

function getStorageClass(type) {
  if (type === GLUSTERFS) {
    return config.get('glusterFSStorageClass');
  } if (type === NFS) {
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
