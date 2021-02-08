import metadataGenerators from './metadataGenerators';

const generator = () => ({
  annotations: { 'test/annotation': 'test annotation value' },
});

describe('checkResourceHasMetadataFromGenerator', () => {
  it('returns truthy if the metadata returned from generator is present in the provided resource', () => {
    const resource = {
      kind: 'TestResource',
      metadata: {
        annotations: { 'test/annotation': 'test annotation value' },
      },
    };

    expect(metadataGenerators.checkResourceHasMetadataFromGenerator(resource, generator)).toBeTruthy();
  });

  it('returns truthy if the metadata returned from generator is present in the provided resource when resource has extra metadata', () => {
    const resource = {
      kind: 'TestResource',
      metadata: {
        labels: { 'test/label': 'test label value' },
        annotations: {
          'test/annotation': 'test annotation value',
          'another/annotation': 'another annotation value',
        },
      },
    };

    expect(metadataGenerators.checkResourceHasMetadataFromGenerator(resource, generator)).toBeTruthy();
  });

  it('returns falsy if the metadata returned from generator is present in the provided resource', () => {
    const resource = {
      kind: 'TestResource',
      metadata: {
        annotations: { 'incorrect/annotation': 'incorrect annotation value' },
      },
    };

    expect(metadataGenerators.checkResourceHasMetadataFromGenerator(resource, generator)).toBeFalsy();
  });
});
