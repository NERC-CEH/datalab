import { findKey } from 'lodash';

const stackSecretMetadata = () => ({ annotations: { 'datalab/type': 'stack-secret' } });

const checkResourceHasMetadataFromGenerator = (resource, generator) => {
  const requiredMetadata = generator();
  return findKey(resource, requiredMetadata) === 'metadata';
};

export default {
  stackSecretMetadata,
  checkResourceHasMetadataFromGenerator,
};
