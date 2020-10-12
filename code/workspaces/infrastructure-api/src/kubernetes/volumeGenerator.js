import { stackTypes } from 'common';
import config from '../config/config';
import { VolumeTemplates, generateManifest } from './manifestGenerator';

function getStorageClass(type) {
  if (type === stackTypes.GLUSTERFS_VOLUME) {
    return config.get('glusterFSStorageClass');
  } if (type === stackTypes.NFS_VOLUME) {
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
