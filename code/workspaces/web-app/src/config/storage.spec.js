import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import data from 'common/src/config/storage_config.json';
import { initialiseStorage, storageCreationAllowedDisplayOptions, storageCreationDefaultType, storageDisplayValue, storageDescription } from './storage';

const httpMock = new MockAdapter(axios);
httpMock.onGet('/storage_config.json')
  .reply(() => [200, data]);

describe('storage config', () => {
  it('returns default storage type for creation', async () => {
    await initialiseStorage();
    expect(storageCreationDefaultType()).toEqual('GLUSTERFS');
  });

  it('returns storage options allowed for creation', async () => {
    await initialiseStorage();
    expect(storageCreationAllowedDisplayOptions()).toEqual([
      { text: 'GlusterFS', value: 'GLUSTERFS' },
      { text: 'NFS', value: 'NFS' },
    ]);
  });

  it('returns storage display value', async () => {
    await initialiseStorage();
    expect(storageDisplayValue('1')).toEqual('GlusterFS');
    expect(storageDisplayValue('GLUSTERFS')).toEqual('GlusterFS');
    expect(storageDisplayValue('NFS')).toEqual('NFS');
  });

  it('returns storage description', async () => {
    await initialiseStorage();
    expect(storageDescription('1')).toEqual('Gluster File System (GlusterFS) volume to store data for Notebooks and Sites.');
    expect(storageDescription('GLUSTERFS')).toEqual('Gluster File System (GlusterFS) volume to store data for Notebooks and Sites.');
    expect(storageDescription('NFS')).toEqual('Network File System (NFS) volume to store data for Notebooks and Sites.');
  });
});
