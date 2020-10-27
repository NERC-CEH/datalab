import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import data from 'common/src/config/storage_config.json';
import { storageTypes, storageCreationAllowedDisplayOptions, storageDisplayValue, storageDescription } from './storage';

const httpMock = new MockAdapter(axios);
httpMock.onGet('/storage_config.json')
  .reply(() => [200, data]);

describe('storage config', () => {
  it('returns storage types', async () => {
    expect(await storageTypes()).toEqual(['1', 'GLUSTERFS', 'NFS']);
  });

  it('returns storage options allowed for creation', async () => {
    expect(await storageCreationAllowedDisplayOptions()).toEqual([
      { text: 'GlusterFS', value: 'GLUSTERFS' },
      { text: 'NFS', value: 'NFS' },
    ]);
  });

  it('returns storage display value', async () => {
    expect(await storageDisplayValue('1')).toEqual('GlusterFS');
    expect(await storageDisplayValue('GLUSTERFS')).toEqual('GlusterFS');
    expect(await storageDisplayValue('NFS')).toEqual('NFS');
  });

  it('returns storage description', async () => {
    expect(await storageDescription('1')).toEqual('Gluster File System (GlusterFS) volume to store data for Notebooks and Sites.');
    expect(await storageDescription('GLUSTERFS')).toEqual('Gluster File System (GlusterFS) volume to store data for Notebooks and Sites.');
    expect(await storageDescription('NFS')).toEqual('Network File System (NFS) volume to store data for Notebooks and Sites.');
  });
});
