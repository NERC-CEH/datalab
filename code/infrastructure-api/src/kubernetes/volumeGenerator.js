import config from '../config/config';
import { VolumeTemplates, generateManifest } from './manifestGenerator';

function createVolume(name, volumeSize) {
  const context = {
    name,
    volumeSize,
    storageClass: config.get('storageClass'),
  };
  return generateManifest(context, VolumeTemplates.DEFAULT_VOLUME);
}

export default { createVolume };
