import { storageClass, storageCreationAllowedTypes } from 'common/src/config/storage';
import { VolumeTemplates, generateManifest } from './manifestGenerator';

async function createVolume(name, volumeSize, type) {
  if (!storageCreationAllowedTypes().includes(type)) {
    throw new Error(`Unrecognized storage class type ${type}`);
  }

  const context = {
    name,
    volumeSize,
    storageClass: storageClass(type),
  };
  return generateManifest(context, VolumeTemplates.DEFAULT_VOLUME);
}

export default { createVolume };
