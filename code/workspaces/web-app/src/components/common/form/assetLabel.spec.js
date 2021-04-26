import assetLabel from './assetLabel';

describe('assetLabel', () => {
  it('gives expected contents', () => {
    expect(assetLabel({ name: 'name', version: 'version', fileLocation: 'fileLocation' })).toEqual('name:version (fileLocation)');
  });
  it('handles unknown file location', () => {
    expect(assetLabel({ name: 'name', version: 'version' })).toEqual('name:version (no local file)');
  });
});
